# Allow the absolute maximum number of ports
sudo sysctl -w net.inet.ip.portrange.first=1024
sudo sysctl -w net.inet.ip.portrange.last=65535

# Drastically lower the TIME_WAIT socket reuse delay (default is 30000ms)
sudo sysctl -w net.inet.tcp.msl=1000

# Increase maximum file descriptors system-wide
sudo sysctl -w kern.maxfiles=200000
sudo sysctl -w kern.maxfilesperproc=150000

# Increase your current terminal session limit
ulimit -n 100000
