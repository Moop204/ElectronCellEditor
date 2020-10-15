#include <node.h>
#include <nan.h>
#include <string>
#include <fstream>
#include <sstream>
#include <libcellml/parser.h>
#include <libcellml/validator.h>
#include <iostream>
#include <filesystem>

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Value;

std::string readFile(std::string &file)
{
  auto p = std::filesystem::current_path();
  //std::cout << "root: " << p.root_directory();
  std::cout << "Reading file: " << file << std::endl;
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
  for (auto i = 0; i < int(v->issueCount()); ++i)
  {
    std::cout << i << ": " << v->issue(i)->description() << std::endl;
  }
}

//using namespace Nan;
using namespace std;
using namespace v8;

int LocalToString(Isolate *isolate, Local<Context> context, Local<Value> item, std::string &file)
{
  if (!item->IsString())
  {
    return -1;
  }
  MaybeLocal<String> maybe_str = item->ToString(context);
  if (maybe_str.IsEmpty())
  {
    return -1;
  }
  // at this point we should be safe with this string
  Local<String> l_str = maybe_str.ToLocalChecked();
  size_t len = l_str->Utf8Length(isolate);
  char *buf = (char *)malloc(len + 1);
  if (!buf)
    return -1;
  auto res_write = l_str->WriteUtf8(isolate, buf, len, NULL, 0);
  if (!res_write)
  {
    free(buf);
    return -1;
  }
  file = *new std::string(buf, len);
  free(buf);
  return 0;
}

static std::string loadFile(std::string file)
{
  auto s = readFile(file);
  Parsing(s);

  return s;
}

void importFile(const Nan::FunctionCallbackInfo<v8::Value> &info)
{

  Isolate *isolate = info.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (info.Length() < 1)
  {
    Nan::ThrowTypeError("get_string_length expect 1 argument");
    return;
  }

  std::string file;
  LocalToString(isolate, context, info[0], file);
  std::string result = loadFile(file);
  std::cout << result;
  if (result.length() == 0)
  {
    Nan::ThrowTypeError("Something went wrong.");
    return;
  }
  Nan::MaybeLocal<String> mResponse = Nan::New(file); //Nan::New(static_cast<uint32_t>(5));
  if (mResponse.IsEmpty())
  {
    return -1;
  }
  Local<String> response = mResponse.ToLocalChecked();

  info.GetReturnValue().Set(response);
}

NAN_MODULE_INIT(ReaderInit)
{
  Nan::Set(target,
           Nan::New<String>("importFile").ToLocalChecked(),
           Nan::GetFunction(Nan::New<FunctionTemplate>(importFile)).ToLocalChecked());
}
NODE_MODULE(addon, ReaderInit)