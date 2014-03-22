var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}

var templater = function(string, object) {
  string = string || "";
  var copy = string.slice();
  var exp;
  for(var key in object) {
    //debugger;
    var escapedVar = new RegExp("{{" + key + "}}",'gm');
    //var nonEscapedVar = new RegExp("{{{" + key + "}}}",'gm');
    var escapedValue = escapeHtml(object[key]);
    copy = copy.replace(escapedVar, escapedValue);
  }
  copy = copy.replace(/\{\{[\s]*[\w]+[\s]*\}\}/g, "");
  return copy;
};