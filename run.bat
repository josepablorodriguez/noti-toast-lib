#The idea behind this command is to be able to open the index.html with out having the CORS error, as the script inserted into #the html file is of type="module" instead of type="text/javascript".
#So you are able to open up a chrome instance WITHOUT web security, PLEASE don't browse the Web with chrome while using this #option, the secure way of doing this is by running a web server, but for a fast test this is just convenient.
#
#BEFORE excuting the command, create the folders: "\my\data" inside your "\Documents" folder

cd C:\Program Files\Google\Chrome\Application
chrome.exe --user-data-dir="C:\Users\JosePabloRodriguez\Documents\my\data" --disable-web-security