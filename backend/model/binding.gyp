{
  "targets": [
    {
      "target_name": "Reader",
      "sources": [ "reader.cpp" ],
      "cflags_cc" : [ "-std=c++17", "-lcellml", "-lxml" ],
      "libraries": [
        "/usr/local/lib/libcellml.so"
      ],
      "include_dirs" : [
        "<!(node -e \"require('nan')\")"
      ],
    }

  ]
}
