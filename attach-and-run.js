// ==UserScript==
// @name         Databricks Notebook If-Attach-Then-Run
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Monitor Databricks cluster-attach requests and run custom commands when the specified event occurs
// @author       Shu Wu
// @match        https://*.azuredatabricks.net/*
// @match        https://*.databricks.azure.cn/*
// @match        https://*.cloud.databricks.com/*
// @match        https://*.gcp.databricks.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // this is the event when you manually attach or reattach a cluster to your notebook via UI
    const targetPayload = {
        clusterId: "0324-011048-s9n12ml5", // change this to your preferred cluster Id
        "@method": "detachAndAttach"
    };

    // this is the event when you create a new notebook via UI
    const targetPayload2 = {
        newPythonIndentUnit: 2,
        "@method": "setPythonIndentUnit"
    };

    const secondPayload = {
        commandText: "%sql\n\nuse aact_nct;", // change this to your preferred command text
        execute: "true",
        position: 1,
        guid: "12345",
        lastModifiedBy: "12345",
        "@method": "addCmd"
    };

    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url) {
            this._requestHeaders = {};

            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && this.status === 204 && method === 'POST' && url.includes('/notebook/')) {
                    try {
                        const requestData = JSON.parse(this._requestBody);

                        // Check if requestData matches targetPayload or targetPayload2
//                         if (JSON.stringify(requestData) === JSON.stringify(targetPayload) || JSON.stringify(requestData) === JSON.stringify(targetPayload2)) {
//                             sendSecondPayload(this._requestHeaders);
//                         }

                        // If you want to apply the 1st target pattern across all clusters on UI, you can comment out the above and uncomment the below
                        // Check if requestData.@method matches targetPayload.@method or requestData matches targetPayload2
                        if (requestData["@method"] === targetPayload["@method"] || JSON.stringify(requestData) === JSON.stringify(targetPayload2)) {
                            sendSecondPayload(this._requestHeaders);
                        }
                    } catch (e) {
                        console.error('Error parsing request data:', e);
                    }
                }
            });

            open.call(this, method, url);
        };
    })(XMLHttpRequest.prototype.open);

    (function(send) {
        XMLHttpRequest.prototype.send = function(data) {
            this._requestBody = data;
            send.call(this, data);
        };
    })(XMLHttpRequest.prototype.send);

    (function(setRequestHeader) {
        XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            this._requestHeaders[header] = value;
            setRequestHeader.call(this, header, value);
        };
    })(XMLHttpRequest.prototype.setRequestHeader);

    function sendSecondPayload(headers) {
        const baseUrl = window.location.protocol + '//' + window.location.host;
        const notebookId = window.location.hash.split('/')[1];
        const requestUrl = `${baseUrl}/notebook/${notebookId}`;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', requestUrl, true);
        for (let header in headers) {
            xhr.setRequestHeader(header, headers[header]);
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log('Second payload sent successfully');
            }
        };
        xhr.send(JSON.stringify(secondPayload));
}
})();
