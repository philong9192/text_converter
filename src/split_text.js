'use strict';

import xlsx from 'node-xlsx';
import path, { join } from "path";
import fs from 'fs';

const __dirname = path.resolve();
const fs2 = fs.promises;

const onExportFile = async (arrText) => {

	const sheetOptions = {'!cols': [{ wch: 50 }, { wch: 15 }, { wch: 40 }, { wch: 10 }, { wch: 15 } ]};

	let buffer = xlsx.build([{name: "sheet1", data: arrText}], { sheetOptions }); // Returns a buffer

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
	
	dataFixed = dataFixed.replace(/sốn/g, "");
	dataFixed = dataFixed.replace(/h0ặc/g, "");
	dataFixed = dataFixed.replace(/D14:D/g, "");

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

	const arrDataFixed5 = dataFixed.split('Hoặc');

	if (arrDataFixed5.length == 2) {
		dataFixed = arrDataFixed5[0];
	}

	const arrDataFixed6 = dataFixed.split('HOẶC');

	if (arrDataFixed6.length == 2) {
		dataFixed = arrDataFixed6[0];
	}

	const arrDataFixed7 = dataFixed.split('vs');

	if (arrDataFixed7.length == 2) {
		dataFixed = arrDataFixed7[0];
	}

	const arrDataFixed8 = dataFixed.split('D');

	if (arrDataFixed8.length == 2) {
		dataFixed = arrDataFixed8[0];
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

const isNumber = (_char) => {
    if (
        _char == ' ' || 
        _char == '.' || 
        _char == '0' || 
        _char == '1' || 
        _char == '2' || 
        _char == '3' || 
        _char == '4' || 
        _char == '5' || 
        _char == '6' || 
        _char == '7' || 
        _char == '8' || 
        _char == '9'
    ) return true;
    return false;
}

const takeNumberFormText = (text) => {

    let phoneNumber = "";

    for (const _char of text) {
        if (isNumber(_char)) {
            phoneNumber = phoneNumber + _char;
			continue;
        }
		if (phoneNumber.length >= 10) {
			break;
		}
		phoneNumber = "";
    }

	if (phoneNumber.length < 10) {
		phoneNumber = "";
	}

    // console.log('phoneNumber', fixSoDienThoai(phoneNumber));

    return fixSoDienThoai(phoneNumber);
}

const splitText = () => {

    // takeNumberFormText("ODL14445:Bích Ngọc:097 931 54 35/0349086206:Điện Biên");
    // return;

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
    // console.log('sheetOneData', sheetOneData);

    let arrData = [];

    for (const arrText of sheetOneData) {
        if (arrText.length == 0) continue;
        let text = arrText[0];
        // console.log(text);
        let data = []
        for (const txt of text.split("-")) {
            data.push(txt);
        }
        arrData.push(data);
    }

    // console.log('arrData', arrData);
    onExportFile(arrData);
}

export {
    splitText,
}