FROM dwhunt/emsdk-base

########################################################
# Essential packages for remote debugging and login in
########################################################

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
    apt-utils git gcc g++ openssh-server cmake build-essential gdb gdbserver rsync vim sudo nano ruby-full python \
    && apt-get install -y software-properties-common

# Install DOTNET CORE 3
# RUN wget -q https://packages.microsoft.com/config/ubuntu/18.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
# RUN dpkg -i packages-microsoft-prod.deb

#RUN add-apt-repository universe && apt-get update && apt-get install -y apt-transport-https && apt-get update \
#    && apt-get install -y dotnet-sdk-3.0 && export DOTNET_CLI_TELEMETRY_OPTOUT=1

RUN mkdir /var/run/sshd
RUN echo 'root:root' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

# Comment out lines to build keystone manually ----------------------------
# Get and build Keystone
RUN git clone https://github.com/keystone-engine/keystone.git
RUN cd keystone && mkdir build && cd build && ../make-share.sh && make install

RUN echo '/usr/local/lib' >> /etc/ld.so.conf
RUN ldconfig
# -------------------------------------------------------------------------

# 22 for ssh server. 7777 for gdb server.
EXPOSE 22 7777
EXPOSE 5000 5000
EXPOSE 3000 3000
EXPOSE 4000 4000

RUN useradd -ms /bin/bash debugger
RUN echo 'debugger:pwd' | chpasswd
RUN usermod -aG sudo debugger

########################################################
# Add custom packages and development environment here
########################################################

########################################################

CMD ["/usr/sbin/sshd", "-D"]