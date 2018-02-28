import Paho from 'paho-mqtt'

const Message = {

    /**
     * 加入房間
     * @param {string} master 
     */
    JoinRoom(master) {
        this.payload = new Paho.Message(JSON.stringify({
            action: 'join',
            key: master
        }))
        this.payload.destinationName = 'room'
        this.payload.qos = 0
        return this.payload
    },

    /**
     * 開新房間
     * @param {string} master 
     */
    CreateRoom(master) {
        this.payload = new Paho.Message(JSON.stringify({
            action: 'create',
            key: master
        }))
        this.payload.destinationName = 'room'
        this.payload.qos = 0
        return this.payload
    },

    /**
     *  新玩家加入
     * @param {string} master
     * @param {string} player
     * @param {number} x
     * @param {number} y
     */
    NewPlayer(master) {
        this.payload = new Paho.Message(JSON.stringify({
            team: 0,
            id: 'client1',
            hp: 100,
            x: 30,
            y: 30,
            name: 'abc',
            result: 'success'
        }))
        this.payload.destinationName = `join/${master}`
        this.payload.qos = 0
        return this.payload
    },

    /**
     * 刪除角色
     * @param {string} master 
     * @param {string} player 
     */
    RemovePlayer(master, player) {
        this.payload = new Paho.Message(JSON.stringify({
            id: player,
        }))
        this.payload.destinationName = `delete/${master}`
        this.payload.qos = 0
        return this.payload
    },

    /**
     * 刪除房間
     * @param {string} master
     */
    RemoveRoom(master) {
        this.payload = new Paho.Message(JSON.stringify({
            key: master,
        }))
        this.payload.destinationName = `delete_room`
        this.payload.qos = 0
        return this.payload
    },

    /**
     *  移動角色
     * @param {string} master
     * @param {string} player
     * @param {number} x
     * @param {number} y
     */
    MovePlayer(master, player, x, y) {
        this.payload = new Paho.Message(JSON.stringify({
            x: x,
            y: y,
            id: player
        }))
        this.payload.destinationName = `game/${master}`
        this.payload.qos = 0
        return this.payload
    },

    /**
     *  發送當前所有Actor的所有位置
     * @param {string} master
     * @param {string} player 
     */
    BroadcastPlayer(master, player) {
        this.payload = new Paho.Message(JSON.stringify({
            team: 0,
            hp: 100,
            attack: 50,
            x: 30,
            y: 30,
            others: [{
                team: 0,
                id: 'client2',
                hp: 100,
                x: 40,
                y: 40,
            }, {
                team: 0,
                id: 'client3',
                hp: 100,
                x: 50,
                y: 50,
            }]
        }))
        this.payload.destinationName = `game/${master}/${player}`
        this.payload.qos = 0
        return this.payload
    },
}
export default Message