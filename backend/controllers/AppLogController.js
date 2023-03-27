const fs = require("fs");

const getAll = async (req, res) => {
  await fs.readFile("./logs/backup/app-2023-03-27.log", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    jsonString = `${data}`;
    const lines = jsonString.trim().split("\n");
    const jsonArray = lines
      .map((line, index) => {
        // Jika line terakhir dan tidak terdapat karakter newline
        if (index === lines.length - 1 && line.trim() === "") {
          return null;
        }
        return JSON.parse(line);
      })
      .filter((obj) => obj !== null);

    console.log(jsonArray);
    res.send(jsonArray);
  });
};

module.exports = { getAll };
