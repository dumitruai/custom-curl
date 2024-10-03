#!/usr/bin/env node

import net from "net";
import { Command } from 'commander';
import * as process from "node:process";
import * as tls from "tls";
import {RequestProcessor} from "./src"; // Required for HTTPS connections

const program = new Command();

program
    .version("1.0.0")
    .description("Custom Curl")
    .argument("<host>", "Add your host (with or without protocol)")
    .option("-m, --method <method>", "Add your method", "GET")
    .action((host, options) => {
        const method = options.method;

        // Check if the host starts with 'https'
        if (host.startsWith("http://")) {
            const processor = new RequestProcessor(host)
            processor.processHttpRequest()
        } else if (host.startsWith("https://")) {
            const processor = new RequestProcessor(host)
            processor.processHttpsRequest()
        } else {
            host = `https://${host}`;
            const processor = new RequestProcessor(host)
            processor.processHttpsRequest()
        }

    })
    .parse(process.argv);
