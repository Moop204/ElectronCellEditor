cmd_Release/Reader.node := ln -f "Release/obj.target/Reader.node" "Release/Reader.node" 2>/dev/null || (rm -rf "Release/Reader.node" && cp -af "Release/obj.target/Reader.node" "Release/Reader.node")
