/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// var myBoxitNIT = '155638317-22018';

// Nota: El NIT de myBoxit debe ser definido en el servicio "userData"
var host = "http://142.93.30.194:8080";
angular
.module('boxit')
.factory('NequiService', function ($http, $q, $localStorage, userData) {
    var factory = {};

    /**
     * Inicia el proceso de pago mediante Nequi QR
     * @description Permite obtener desde los servicios de Nequi el string code necesario para generar el código QR a ser presentado al usuario
     *              Al String code devuelto por la función se le debe adicionar "bancadigital-"
     * @param {string} phoneNumber Número de celular del comprador
     * @param {number} amount Monto a ser pagado a través de Nequi
     * @return {promise}    resolve = string code para el código QR, reject = error
     */
    factory.payWithQR = function (phoneNumber, amount) {

        return $http({
            method: "POST",
            url: host +  "/nequi/generateCodeQR",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                phoneNumber: phoneNumber,
                amount: amount
            }
        }).then(function success(result) {
            return result.data;
        });
    };

    /**
     * Verifica el estado de una transacción mediante su string code
     * @param {string} phoneNumber Número de celular del comprador
     * @param { string } codeQR string code recibido en payWithQR
     * @return { promise }  resolve= objeto respuesta (ver a continuación), reject=error
     * 
     * Nota: objeto response
     *      {
     *          "status": "33",   // 33 = Pendiente, 35 = Realizado
     *          "name": "Test",
     *          "value": "1",
     *          "date": "Junio 22 - 2017 | 10:18 AM",
     *          "trnId": "      M28",
     *          "originMoney": [{
     *              "name": "Disponible",
     *              "pocketType": "4",
     *              "value": "1"
     *          }],
     *          "ipAddress": ""
     *      }
     */
    factory.paymentStatus = function (phoneNumber, codeQR) {
        return $http({
            method: "POST",
            url: host +  "/nequi/statusPayment",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                phoneNumber: phoneNumber,
                codeQR: codeQR
            }
        }).then(function success(result) {
            return result.data;
        });
    };

    /**
     * Inicia el proceso de pago mediante Nequi Push
     * @description Permite obtener desde los servicios de Nequi el string code necesario para generar el código QR a ser presentado al usuario
     * @param {string} phoneNumber Número de celular del comprador
     * @param {number} amount Monto a ser pagado a través de Nequi
     * @return {promise}    resolve = string code para el código QR, reject = error
     */
    factory.payWithPush = function (phoneNumber, amount) {

        return $http({
            method: "POST",
            url: host +  "/nequi/unregisteredPayment",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                phoneNumber: phoneNumber,
                amount: amount
            }
        }).then(function success(result) {
            return result.data;
        });
    };

    /**
     * Realiza la revera de un pago mediante Nequi QR o Push
     * @description Realiza la revera de un pago mediante Nequi QR o Push
     * @param {string} phoneNumber Número de celular del comprador
     * @param {number} amount Monto a ser pagado a través de Nequi
     * @param {string} messageId MessageId de la transacción a reversar. Extraer del respponse de la transacción
     * @return {promise}    resolve = 'Ok', reject = error
     */
    factory.reverseTransaction = function (phoneNumber, amount, messageId) {

        return $http({
            method: "POST",
            url: host +  "/nequi/reverseTransaction",
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                phoneNumber: phoneNumber,
                amount: amount,
                messageId: messageId
            }
        });
    };

    return factory;
});