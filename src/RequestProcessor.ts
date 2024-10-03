import net from "net";
import * as tls from "node:tls";

export class RequestProcessor {
    url: URL;

    constructor(fullUrl: string) {
        this.url = new URL(fullUrl);  // Parse the full URL
    }

    private generateGetHeader() {
        const path = this.url.pathname + this.url.search || '/';
        return `GET ${path} HTTP/1.1\r\n` +
            `Host: ${this.url.host}\r\n` +
            `Connection: close\r\n` +  // Close the connection after the response
            `User-Agent: Custom-Curl/1.0\r\n` +
            `Accept: */*\r\n` +  // Accept any content type
            `\r\n`;  // End of the header
    }

    processHttpRequest() {
        const port = this.url.port || 80;  // Use the port from the URL or default to 80 for HTTP
        const host = this.url.hostname;    // Extract the hostname from the URL

        const socket = new net.Socket();
        socket.connect(Number(port), host);

        socket.on('connect', () => {
            console.log(`Sending request GET ${this.url.pathname} HTTP/1.1`);

            // Send the GET request header
            const getRequest = this.generateGetHeader();
            socket.write(getRequest);

            // Handle response data
            socket.on('data', (data) => {
                console.log(data.toString());
            });
        });

        socket.on('error', (err) => {
            console.error(`Error: ${err.message}`);
        });

        socket.on('end', () => {
            console.log('Disconnected');
        });
    }

    processHttpsRequest() {
        const port = this.url.port || 443;  // Use the port from the URL or default to 443 for HTTPS
        const host = this.url.hostname;     // Extract the hostname from the URL

        const socket = tls.connect(Number(port), host, { rejectUnauthorized: false }, () => {
            console.log(`Sending request GET ${this.url.pathname} HTTP/1.1`);


            // Send the GET request header for HTTPS
            const getRequest = this.generateGetHeader();
            socket.write(getRequest);

            // Handle response data
            socket.on('data', (data) => {
                console.log(data.toString());
            });

        });

        socket.on('end', () => {
            console.log('Disconnected');
        });

        socket.on('error', (err) => {
            console.error(`Error: ${err.message}`);
        });
    }
}