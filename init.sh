rm -rf db/conversations.db
touch db/conversations.db
cat ./db/init.sql | sqlite3 ./db/conversations.db