'use strict';

import xlsx from 'node-xlsx';
import path, { join } from "path";
import fs from 'fs';

const __dirname = path.resolve();
const fs2 = fs.promises;

const TYPE = {
	FIX_SO_DIEN_THOAI: 0,
	FIX_KHONG_NHAY_DONG: 1,
}

/* ---------------------- NHAP DU LIEU TU DAY ---------------------- */

const __DATA = `

`

const type = TYPE.FIX_SO_DIEN_THOAI
// const type = TYPE.FIX_KHONG_NHAY_DONG


/* ------------------------------------------------------------------ */

const onExportFile = async (arrText) => {

	const options = {'!cols': [{ wch: 15 }, { wch: 30 }, { wch: 40 }, { wch: 10 }, { wch: 15 } ]};

	let buffer = xlsx.build([{name: "sheet1", data: arrText}], options); // Returns a buffer

	const pathFile = path.join(__dirname, 'files', 'exported_data.xlsx');

	try {
		await fs2.writeFile(pathFile, buffer);
	} catch (err) {
		return console.log(err);
	}

    console.log("Xuất file thành công!!!");
}

const fixSoDienThoai = (text) => {

	let dataFixed = "";
	
	dataFixed = text.replace(/đ/g, "");
	dataFixed = dataFixed.replace(/st:/g, "");
	dataFixed = dataFixed.replace(/St:/g, "");
	dataFixed = dataFixed.replace(/\./g, "");
	dataFixed = dataFixed.replace(/\,/g, "");
	dataFixed = dataFixed.replace(/ /g, "");
	dataFixed = dataFixed.replace(/-/g, "");
	dataFixed = dataFixed.replace(/St/g, "");
	dataFixed = dataFixed.replace(/\*/g, "");

	if (dataFixed.startsWith('\`')) {
		dataFixed = dataFixed.replace('\`', "");
	}

	if (dataFixed.startsWith('\'')) {
		dataFixed = dataFixed.replace("\'", "");
	}

	if (dataFixed.startsWith('0:')) {
		dataFixed = dataFixed.replace("0:", "");
	}

	const arrDataFixed = dataFixed.split('/');

	if (arrDataFixed.length == 2) {
		dataFixed = arrDataFixed[0];
	}

	const arrDataFixed1 = dataFixed.split('or');

	if (arrDataFixed1.length == 2) {
		dataFixed = arrDataFixed1[0];
	}

	const arrDataFixed2 = dataFixed.split('và');

	if (arrDataFixed2.length == 2) {
		dataFixed = arrDataFixed2[0];
	}

	const arrDataFixed3 = dataFixed.split('(');

	if (arrDataFixed3.length == 2) {
		dataFixed = arrDataFixed3[0];
	}

	const arrDataFixed4 = dataFixed.split('hoặc');

	if (arrDataFixed4.length == 2) {
		dataFixed = arrDataFixed4[0];
	}

	if (dataFixed.startsWith('84')) {
		dataFixed = dataFixed.replace("84", "0");
	}
	
	if (dataFixed.startsWith('O')) {
		dataFixed = dataFixed.replace("O", "0");
	}

	dataFixed = dataFixed.replace(/\//g, "");
	dataFixed = dataFixed.replace(/\‘/g, "");

	//END add 0
	if (dataFixed.startsWith('9') || dataFixed.startsWith('8') || dataFixed.startsWith('7') || dataFixed.startsWith('3')) {
		dataFixed = "0" + dataFixed
	}

	// console.log(dataFixed);

	return dataFixed;
}

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


if (type === TYPE.FIX_SO_DIEN_THOAI) {
	onStartFixPhoneNumber();
} else if (type === TYPE.FIX_SO_DIEN_THOAI) {
	fixKhongNhayDong();
}