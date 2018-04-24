import HtmlWebpackPlugin from "html-webpack-plugin";
function UseHtmlPlugin(options) {
  // 使用 options 配置你的 plugin
  this.options={
      baseUrl='web'
  }
}

MyPlugin.prototype.apply = function(compiler) {
  compiler.plugin("compile", function(params) {
    console.log("编译器开始编译(compile)……"+params);
  });

  compiler.plugin("compilation", function(compilation) {
    console.log("编译器开始一个新的编译过程(compilation)……");

    compilation.plugin("optimize", function() {
      console.log("编译过程(compilation)开始优化文件...");
    });
  });

  compiler.plugin("emit", function(compilation, callback) {
    console.log("编译过程(compilation)准备开始输出文件……");
    callback();
  });
};

module.exports = UseHtmlPlugin;
