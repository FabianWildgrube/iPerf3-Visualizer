# iPerf3 Visualizer

This is a small web application, that will let you visualize json-files created by calling
```bash
iperf3 -c <server-ip> -J --logfile <filename.json>
```

Chart.js is used to show all the measurements from your network test as a graph, for easier analysis.

Current status:
- 
* Basic json file upload and display working (multiple files for multiple datasets within one graph possible)
* no styling yet
* no error handling yet

<img src="/images/Screen Shot03.png">