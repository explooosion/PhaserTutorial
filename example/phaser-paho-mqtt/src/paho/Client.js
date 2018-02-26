import Paho from 'paho-mqtt'
import Message from './Message'
import {
    bulidMessageObjects
} from '../../utils/paho'

import Config from './config'

export default class Clients {

    constructor(master) {
        this.server = Config.server
        this.port = Config.port
        this.clientid = `mqttclient_'${new Date().getTime()}`
        this.player = ''
        this.master = master
        this.map = ''
        this.status = undefined
        this.reconnectTimeout = 3000
        this.client = null
        this.status = null
    }

    /** 
     * 連線 
     */
    onConnect() {
        this.client = new Paho.Client(this.server, this.port, this.clientid)
        this.client.onConnectionLost = this.onConnectionLost.bind(this)
        this.client.onMessageArrived = this.onMessageArrived.bind(this)

        const connectionOptinos = {
            useSSL: false,
            keepAliveInterval: 30,
            onSuccess: this.onSuccess.bind(this),
            onFailure: this.onFailure.bind(this),
            // userName: 'Username',
            // password: 'password',
        }
        this.client.connect(connectionOptinos)
    }

    /** 
     * 連線成功
     */
    onSuccess() {
        console.log('onSuccess')
        // this.client.send(Message.RemoveRoom(this.master))

        /** Server */
        this.client.subscribe(`room`)
        this.client.subscribe(`newplayer/${this.master}`)

        /** Client */
        this.client.subscribe(`join/${this.master}`)
        this.client.send(Message.JoinRoom(this.master))

    }

    /**
     * 連線失敗
     * @param {object} message 
     */
    onFailure(message) {
        this.status = undefined
        if (responseObject.errorCode !== 0) {
            console.log('onConnectionFail:' + responseObject.errorMessage);
        } else {
            console.log('connection to server fail. Attempting to reconnect in ' + this.reconnectTimeout / 1000 + ' sec')
            setTimeout(this.onConnect.bind(this))
        }
    }

    /**
     * 連線遺失
     * @param {object} responseObject 
     */
    onConnectionLost(responseObject) {
        this.status = undefined
        if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
        } else {
            console.log('connection to server lost. Attempting to reconnect in ' + this.reconnectTimeout / 1000 + ' sec')
            setTimeout(this.onConnect.bind(this))
        }
    }

    /**
     * 訊息接收
     * @param {string} msg 
     */
    onMessageArrived(msg) {

        const message = bulidMessageObjects(msg)

        // console.log(message.payload)

        switch (message.topic) {

            case `room`:
                console.log('room', message.payload)
                this.client.send(Message.NewPlayer(this.master))
                break;

            case `join/${this.master}`:
                // 加入房間成功
                if (message.payload.result === 'success') {
                    this.player = message.payload.id
                    this.map = message.payload.map

                    // console.log('Join Room', message.payload)

                    /** Client */
                    this.client.unsubscribe(`join/${this.master}`)
                    this.client.subscribe(`game/${this.master}/${this.player}`)

                    /** Server */
                    this.onBroadcastPlayer(this.master, this.player)

                } else {

                    console.log('Recreate room')
                    this.client.send(Message.CreateRoom(this.master))
                    this.client.send(Message.JoinRoom(this.master))
                }
                break;

            case `game/${this.master}/${this.player}`:
                // 了解目前狀態
                // console.log('get now status', message.payload)
                this.status = message.payload
                break

            case 'debug':
                this.debug = message.payload
                break;

            case `create${this.master}`:
                console.log('Create Room', message.payload)
                break;

            case `newplayer/${this.master}`:
                console.log('New Player', message.payload)
                break;

            case `game/${this.master}`:
                // console.log('Player Move', message.payload)
                break;

            default:
                // 垃圾訊息
                // console.log(message)
                break;
        }
    }

    /**
     *  移動角色
     * @param {string} master
     * @param {string} player
     * @param {number} x
     * @param {number} y
     */
    onPlayerMoving(master, player, x, y) {
        this.client.send(Message.MovePlayer(master, player, x, y))
    }

    /**
     *  角色資訊
     * @param {string} master
     * @param {string} player
     */
    onBroadcastPlayer(master, player) {
        const that = this
        setTimeout(function () {
            that.client.send(Message.BroadcastPlayer(master, player))
            that.onBroadcastPlayer(master, player)
        }, 1000)
    }
}