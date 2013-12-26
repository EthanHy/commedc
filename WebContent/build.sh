#!/bin/sh

source /etc/profile

svnFile="./WEB-INF/classes/.svnrev"

if [ ! -e "$svnFile" ]; then
   echo "svn file doesn't exist"; exit
else
   echo "svn file exists"
fi

svnRev=$(cat "$svnFile")

# add svn revision for css
sed -i "s/all.css/all.css?v=$svnRev/g" ./WEB-INF/views/index.jsp

# add svn revision for js
sed -i "s/app.js/app.js?v=$svnRev/g" ./WEB-INF/views/index.jsp

# add svn revision for tpl
sed -i "s/svnRev/$svnRev/g" ./src/lib/jquery.mustache.js

# merge css
for file in $(ls ./asset/css/all.css)
do
    cat "${file}" | awk -F '"' '{print "./asset/css/" $2}' | xargs cat > "${file}.merge"
    rm "${file}"
    mv "${file}.merge" "${file}"
    echo "${file} merged"
done

# merge and compress js
for file in $(ls ./asset/js/*.js)
do
    cat "${file}" | awk -F '"' '{print substr($2,7)}' | xargs cat > "${file}.merge"
    rm "${file}"
    mv "${file}.merge" "${file}"
    echo "${file} merged"

    $JAVA_HOME/bin/java -jar ./tool/yuicompressor.jar "${file}" --charset utf-8 -o "${file}.compress"
    rm "${file}"
    mv "${file}.compress" "${file}"
    echo "${file} compressed"
done