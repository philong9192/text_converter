'use strict';

import xlsx from 'node-xlsx';
import path, { join } from "path";
import fs from 'fs';
import { takePhoneNumber, fixSoDienThoai, onExportFile } from "./src/take_phone_number.js";

const __dirname = path.resolve();
const fs2 = fs.promises;

const TYPE = {
	FIX_SO_DIEN_THOAI: 0, //Sửa lỗi số điện thoại
	FIX_KHONG_NHAY_DONG: 1, // Sửa lỗi toàn bộ dữ liệu trong 1 ô
	FIX_SAN_PHAM: 2, //Sửa lỗi sản phẩm nhảy xuống các dòng trắng bên dưới
	TAKE_PHONE_NUMBER: 3, //Lấy số điện thoại từ text
}

/* ---------------------- NHAP DU LIEU TU DAY ---------------------- */

const __DATA = `

`

//const type = TYPE.FIX_SO_DIEN_THOAI
// const type = TYPE.FIX_KHONG_NHAY_DONG
// const type = TYPE.FIX_SAN_PHAM;
const type = TYPE.TAKE_PHONE_NUMBER;

/* ------------------------------------------------------------------ */

// const onExportFile = async (arrText) => {

// 	const options = {'!cols': [{ wch: 15 }, { wch: 30 }, { wch: 40 }, { wch: 10 }, { wch: 15 } ]};

// 	let buffer = xlsx.build([{name: "sheet1", data: arrText}], options); // Returns a buffer

// 	const pathFile = path.join(__dirname, 'files', 'exported_data.xlsx');

// 	try {
// 		await fs2.writeFile(pathFile, buffer);
// 	} catch (err) {
// 		return console.log(err);
// 	}

//     console.log("Xuất file thành công!!!");
// }

// const fixSoDienThoai = (text) => {

// 	let dataFixed = "";
	
// 	dataFixed = text.replace(/đ/g, "");
// 	dataFixed = dataFixed.replace(/st:/g, "");
// 	dataFixed = dataFixed.replace(/St:/g, "");
// 	dataFixed = dataFixed.replace(/\./g, "");
// 	dataFixed = dataFixed.replace(/\,/g, "");
// 	dataFixed = dataFixed.replace(/ /g, "");
// 	dataFixed = dataFixed.replace(/-/g, "");
// 	dataFixed = dataFixed.replace(/St/g, "");
// 	dataFixed = dataFixed.replace(/\*/g, "");
	
// 	dataFixed = dataFixed.replace(/sốn/g, "");
// 	dataFixed = dataFixed.replace(/h0ặc/g, "");
// 	dataFixed = dataFixed.replace(/D14:D/g, "");

// 	if (dataFixed.startsWith('\`')) {
// 		dataFixed = dataFixed.replace('\`', "");
// 	}

// 	if (dataFixed.startsWith('\'')) {
// 		dataFixed = dataFixed.replace("\'", "");
// 	}

// 	if (dataFixed.startsWith('0:')) {
// 		dataFixed = dataFixed.replace("0:", "");
// 	}

// 	const arrDataFixed = dataFixed.split('/');

// 	if (arrDataFixed.length == 2) {
// 		dataFixed = arrDataFixed[0];
// 	}

// 	const arrDataFixed1 = dataFixed.split('or');

// 	if (arrDataFixed1.length == 2) {
// 		dataFixed = arrDataFixed1[0];
// 	}

// 	const arrDataFixed2 = dataFixed.split('và');

// 	if (arrDataFixed2.length == 2) {
// 		dataFixed = arrDataFixed2[0];
// 	}

// 	const arrDataFixed3 = dataFixed.split('(');

// 	if (arrDataFixed3.length == 2) {
// 		dataFixed = arrDataFixed3[0];
// 	}

// 	const arrDataFixed4 = dataFixed.split('hoặc');

// 	if (arrDataFixed4.length == 2) {
// 		dataFixed = arrDataFixed4[0];
// 	}

// 	const arrDataFixed5 = dataFixed.split('Hoặc');

// 	if (arrDataFixed5.length == 2) {
// 		dataFixed = arrDataFixed5[0];
// 	}

// 	const arrDataFixed6 = dataFixed.split('HOẶC');

// 	if (arrDataFixed6.length == 2) {
// 		dataFixed = arrDataFixed6[0];
// 	}

// 	const arrDataFixed7 = dataFixed.split('vs');

// 	if (arrDataFixed7.length == 2) {
// 		dataFixed = arrDataFixed7[0];
// 	}

// 	const arrDataFixed8 = dataFixed.split('D');

// 	if (arrDataFixed8.length == 2) {
// 		dataFixed = arrDataFixed8[0];
// 	}

// 	if (dataFixed.startsWith('84')) {
// 		dataFixed = dataFixed.replace("84", "0");
// 	}
	
// 	if (dataFixed.startsWith('O')) {
// 		dataFixed = dataFixed.replace("O", "0");
// 	}

// 	dataFixed = dataFixed.replace(/\//g, "");
// 	dataFixed = dataFixed.replace(/\‘/g, "");

// 	//END add 0
// 	if (dataFixed.startsWith('9') || dataFixed.startsWith('8') || dataFixed.startsWith('7') || dataFixed.startsWith('3')) {
// 		dataFixed = "0" + dataFixed
// 	}

// 	// console.log(dataFixed);

// 	return dataFixed;
// }

const fixKhongNhayDong = () => {
	let arrText = __DATA.split('\n');
	// console.log(arrText.length);

	let data = [];

	for (const text of arrText) {
		data.push([text]);
	}

	onExportFile(data);
}

const onStartFixPhoneNumber = () => {

	let data = [];

	const arrText = __DATA.split('\n');

	for (const text of arrText) {
		const _text = fixSoDienThoai(text);
		data.push([_text]);
	}

	onExportFile(data);
}

const fixSanPham = () => {

	const pathFile = join(__dirname, 'files', 'data.xlsx');
    // console.log(pathFile);

	let excelData = [];

	try {
		excelData = xlsx.parse(pathFile);
	} catch (err) {
		console.log("Err read file:", err.code);
		process.exit(1);
	}

	if (excelData.length == 0) {
		console.log("File data không có dữ liệu!");
		process.exit(1);
	}

	const sheetOneData = excelData[0].data; //Take just first sheet
	// console.log('sheetOneData', sheetOneData[29347]);

	let tempData = [];

	const pushData = (row, i) => {
		let mathang = row[8];
		// for (const k in row) {
		// 		console.log(k);
		// 		console.log(row[k])
		// 	}
		for (let j = 1; j <= 10; j++) {
			let index = Number(i) + Number(j);
			if (!sheetOneData[index]) {
				break;
			}
			// console.log(i)
			// console.log(index)
			const _row = sheetOneData[index];
			// console.log(_row);
			// console.log(_row.length);
			if (_row.length == 0 || _row[0]) {
				break;
			}
			// console.log(index)
			// console.log(_row[1]);
			
				
			mathang = mathang + " " + _row[8];
		}
		// console.log(mathang);
		let tempRow = [];
		const convertedRow = JSON.parse(JSON.stringify(row));
		// console.log(convertedRow);
		for (const k in convertedRow) {
			if (k == 8) {
				tempRow.push(mathang);
				continue;
			}
			tempRow.push(convertedRow[k]);
		}
		// console.log(tempRow);
		tempData.push(tempRow);
	}

	for (const i in sheetOneData) {
		const row = sheetOneData[i];
		if (row.length == 0 || !row[0]) {
			continue;
		}
		// console.log(row);
		pushData(row, i);
	}

	// console.log(tempData);

    onExportFile(tempData);
}

if (type === TYPE.FIX_SO_DIEN_THOAI) {
	onStartFixPhoneNumber();
} else if (type === TYPE.FIX_SO_DIEN_THOAI) {
	fixKhongNhayDong();
} else if (type === TYPE.FIX_SAN_PHAM) {
	fixSanPham();
} else if (type === TYPE.TAKE_PHONE_NUMBER) {
	takePhoneNumber();
}