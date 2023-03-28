const fs = require("fs");

const getAll = async (req, res) => {
  await fs.readFile("./logs/backup/app-2023-03-28.log", "utf8", (err, data) => {
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
    jsonArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    jsonArray.reverse();
    console.log(jsonArray);

    res.send(jsonArray);
  });
};

module.exports = { getAll };
