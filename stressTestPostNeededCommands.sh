sudo sysctl -w net.inet.ip.portrange.first=49152
sudo sysctl -w net.inet.ip.portrange.last=65535

# also this
sudo sysctl -w net.inet.tcp.msl=30000

# and this
sudo sysctl -w kern.maxfiles=49152
sudo sysctl -w kern.maxfilesperproc=24576
