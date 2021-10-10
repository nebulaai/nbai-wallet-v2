import Vue from 'vue';
let web3 = new Web3(Vue.prototype.network);
web3.setProvider(Vue.prototype.network);

export default web3