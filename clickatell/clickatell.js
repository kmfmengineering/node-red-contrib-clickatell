

module.exports = function(RED) {
    "use strict";

    var DEBUG   = true;
    var MAXLEN  = 160;

    function ClickatellNode(n) {
        // Send SMS to Clickatell

            // Helper functions
            // Function for http post
            function http_post(req_url){
                           var xhr = new XMLHttpRequest();
                           xhr.open("GET", req_url, true);
                            xhr.onreadystatechange = function(){
                                if (xhr.readyState == 4 && xhr.status == 200) {
                                    console.log('success');
                                }
                            };

                            xhr.send();
            }

        var node = this;
        var msg = {};

        RED.nodes.createNode(this, n);

        this.sms_default = n.sms_default;
        this.mobile_default = n.mobile_default;

        node.on('input', function(msg) {
            var number = msg.topic ||  n.mobile_default;
            var text = msg.payload ||  n.sms_default;

            if (/\++\D/.test(number)) {
                node.warn("Destination Number: contains invalid characters. Please enter a valid mobile number");
                return;
            }

            if (text.length > MAXLEN) {
               node.warn("Message length is: " + text.length + ", which exceeds the max SMS message length ("+MAXLEN+") by : " + (text.length - MAXLEN));
               return;
            }

            var url = "https://platform.clickatell.com/messages/http/send?apiKey="+n.api_key+"&to="+number+"&text="+encodeURIComponent(text);
            if (DEBUG){
                console.log("Clickatel : "+number+" & sms : "+text);
            }
            http_post(url);
            // We do not need a response from Clickatell
            // http_get(bal_query);
        });

    }

    RED.nodes.registerType("sms-out", ClickatellNode);
}
