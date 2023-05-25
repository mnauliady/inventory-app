const fs = require("fs");

function Paginator(items, page, per_page) {
  var page = page || 0,
    per_page = per_page || 10,
    offset = page * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page);
  return {
    page: page,
    per_page: per_page,
    pre_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems,
  };
}

const getAll = async (req, res) => {
  // await fs.readFile("./logs/backup/app-2023-03-29.log", "utf8", (err, data) => {
  await fs.readFile("./logs/application.log", "utf8", (err, data) => {
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search_query || "";
    const method = req.query.method || "";
    const level = req.query.level || "";
    if (err) {
      console.error(err);
      return;
    }

    jsonString = `${data}`;
    const lines = jsonString.trim().split("\n");
    let jsonArray = lines
      .map((line, index) => {
        // Jika line terakhir dan tidak terdapat karakter newline
        if (index === lines.length - 1 && line.trim() === "") {
          return null;
        }
        return JSON.parse(line);
      })
      .filter((obj) => obj !== null);

    jsonArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (level != "" && method != "") {
      // console.log("pertama");
      let result1 = jsonArray.filter((a) => a.level.toLowerCase() === level.toLowerCase());
      let result2 = result1.filter((a) => a.method.toLowerCase() === method.toLowerCase());
      jsonArray = result2;
    } else if (level != "" && method == "") {
      // console.log("kedua");
      result1 = jsonArray.filter((a) => a.level.toLowerCase() === level.toLowerCase());
      jsonArray = result1;
    } else if (level == "" && method != "") {
      // console.log("ketiga");
      result2 = jsonArray.filter((a) => a.method.toLowerCase() === method.toLowerCase());
      jsonArray = result2;
    }
    // console.log(jsonArray);
    return res.json(Paginator(jsonArray, page));
  });
};

module.exports = { getAll };
