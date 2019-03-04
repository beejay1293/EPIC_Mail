import fs from 'fs';

class Helper {
  // save a data to a file
  static saveDataToFile(filePath, dataFile, values) {
    const result = dataFile.unshift(values);

    if (result !== -1) {
      fs.writeFile(filePath, JSON.stringify(dataFile), 'utf8', (error) => {
        if (error) {
          console.log(`file not found: ${error}`);
        }
      });
    }

    return values;
  }

  // delete data from a file
  static deleteDataFromFile(filePath, dataFile, values) {
    const result = dataFile.shift(values);

    if (result !== -1) {
      fs.writeFile(filePath, JSON.stringify(dataFile), 'utf8', (error) => {
        if (error) {
          console.log(`file not found: ${error}`);
        }
      });
    }

    return values;
  }

  // generate unique id
  static generateId(dataArray, index) {
    return dataArray.length > 0 ? dataArray[index].id + 1 : 0;
  }

  // find a user by email
  static findUserByEmail(objArr, userEmail) {
    return objArr.find(element => element.email === userEmail);
  }
}

export default Helper;
