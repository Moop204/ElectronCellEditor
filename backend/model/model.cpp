#include <node.h>
#include <nan.h>
#include <libcellml/model.h>

namespace std
{

    class CellMlModel
    {
    public:
        // File Actions
        int readFile(std::string &file, std::string &content);
        int readFolder(std::string &folder, std::string &content);
        int writeFile(std::string &file);
        // Updates Internal Model
        int addModel(std::string &name);

    private:
        vector<libcellml::ModelPtr> model; // Represents files opened
    }

} // namespace std
