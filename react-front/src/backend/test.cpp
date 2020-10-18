#include <string>
#include <fstream>
#include <sstream>
#include <libcellml/parser.h>
#include <libcellml/validator.h>

#include <iostream>
#include <filesystem>

  std::string readFile(std::string &file)
  {
    auto p = std::filesystem::current_path();
    //std::cout << "root: " << p.root_directory();
    std::ifstream f{file};
    std::ostringstream ss;
    ss << f.rdbuf();
    return ss.str();
  }

  void Parsing(std::string &xml)
  {
    auto p = libcellml::Parser::create();
    auto v = libcellml::Validator::create();

    auto m = p->parseModel(xml);
    v->validateModel(m);
    std::cout << "ISSUES: " << v->issueCount() << std::endl;
    for(auto i=0;i<int(v->issueCount()); ++i) {
      std::cout << i << ": " << v->issue(i)->description() << std::endl;
    }
  }

  int mImport(void)
  {
    //auto p = libcellml::Parser::create();
    std::string str = "/home/moop204/Documents/uni/thesis/OpenCellEd/backend/sample.xml";

    auto s = readFile(str);
    std::cout << s << std::endl;
    Parsing(s);
    return 5;
  }

int main(void) {
  return mImport();
}
