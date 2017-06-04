#  read -p "Do you wish to install this program?" yn
#     case $yn in
#         [Yy]* ) npm config set proxy http://one.proxy.att.com:8080; break;;
#         [Nn]* ) npm config delete proxy; exit;;
#         * ) echo "Please answer yes or no.";;
#     esac
echo "Do I set att proxy for npm?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) npm config set proxy http://one.proxy.att.com:8080; break;;
        No ) npm config delete proxy; exit;;
        * ) echo "Please answer yes or no.";;
    esac
done
