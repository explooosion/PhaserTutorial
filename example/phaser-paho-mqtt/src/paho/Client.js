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
        this.reconnectTimeout = 3000
        this.receive = null
        this.client = null
        this.status = null
        this.is_join = true
    }

    /** 
     * 連線 
     */
    onConnect() {
        this.client = new Paho.Client(this.server, this.port, this.clientid)
        this.client.onConnectionLost = this.onConnectionLost.bind(this)
        // this.client.onMessageArrived = this.onMessageArrived.bind(this)

        const connectionOptinos = {
            useSSL: false,
            keepAliveInterval: 30,
            // reconnect: true,
            onSuccess: this.onSuccess.bind(this),
            onFailure: this.onFailure.bind(this),
            // userName: 'Username',
            // password: 'password',
        }
        this.client.connect(connectionOptinos)
    }

    /** 
     * 連線中斷
     */
    onDisconnect(reconnect) {
        this.receive = undefined
        this.client.send(Message.RemovePlayer(this.master, this.player))
        this.client.disconnect()
        if (reconnect) {
            this.is_join = false
            this.onConnect()
        }
    }

    /** 
     * 連線成功
     */
    onSuccess() {
        console.log('onSuccess')
        // this.client.send(Message.RemoveRoom(this.master))

        /** Server */
        // this.client.subscribe(`room`)
        // this.client.subscribe(`newplayer/${this.master}`)

        /** Client */
        this.client.subscribe(`join/${this.master}`)
        if (this.is_join) {
            this.client.send(Message.JoinRoom(this.master))
        }

    }

    /**
     * 連線失敗
     * @param {object} responseObject 
     */
    onFailure(responseObject) {
        this.receive = undefined
        if (responseObject.errorCode !== 0) {
            console.log('onConnectionFail:' + responseObject.errorMessage)
        }
    }

    /**
     * 連線遺失
     * @param {object} responseObject 
     */
    onConnectionLost(responseObject) {
        this.receive = undefined
        if (responseObject.errorCode !== 0) {
            console.log('disonnection success.')
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

    /**
     *  狀態回調
     * @param {string} master
     * @param {string} player
     */
    on(value, callback) {
        if (this.receive) {
            if (value === this.receive.topic) {
                callback(this.receive.payload)
            }
        }
    }
}