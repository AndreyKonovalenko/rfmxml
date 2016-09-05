
"use strict";

var fs = require('fs'),
    xml2js = require('xml2js'),
    util = require('util'),
    zipFolder = require('zip-folder');

function main_logic(filename, message_quantity, number_of_first_сontract, last_number){
  var parser = new xml2js.Parser();
  for (var i = 1; i <= message_quantity; i++) {
    var new_file_name = filename_builder(i, filename); // глобально передаю имя сгерерированного файла
    var n = i;
    var data = fs.readFileSync(__dirname + '/uploads/' + filename);
    parser.parseString(data, function (err, result) {
      my_tag(result, new_file_name, n, number_of_first_сontract, last_number);
      console.log('Done');
      });
    }
  zipFolder(__dirname + '/downloads', __dirname + '/uploads/archive.zip', function(err) {
    if(err) {
        console.log('oh no!', err);
    } else {
        console.log('EXCELLENT');
    }
  });
}

function filename_parser(file){
  var firstpart = file.slice(0, -4); // slice .xml
  var today_mess_num = Number(firstpart.slice(-3)); // -номер последнего соообщеня сегодня;
  var new_mess_firstpart = firstpart.slice(0, -3); //slice 034
  return [firstpart, today_mess_num, new_mess_firstpart];
}

function filename_builder(i, filename){
  var my_arr = filename_parser(filename);
  var new_name = my_arr[2];
  if (my_arr[1] < 100 && my_arr[1] > 9) {
    new_name += '0' + (my_arr[1] + i).toString() + '.xml';
  }else if (my_arr[1]<10){
    new_name += '00' (my_arr[1] + i).toString() + '.xml';
  }else {
    new_name += (my_arr[1] + i).toString() + '.xml';
  }
  return new_name;
}

function my_tag(input, new_file, n, number_of_first_сontract, last_number) { // это функцая должна модифицирова ть xml file
  var result = {},
      new_ob = input;

  var number_of_record = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['НомерЗаписи'][0];

  var payment_basis_number = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ОснованиеОп'][1]['НомДок'][0];
  var payment_basis = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ОснованиеОп'][0]['СодДок'][0];
  var nature_of_the_operation = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ХарактерОп'][0];
  var purpose_of_payment = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['НазнПлатеж'][0];
  
  var replace_contract = replace_contract_maker(n, number_of_first_сontract);
  var replace_element = last_messege_number_maker(n, last_number);

  number_of_record = number_of_record_element_replacer(number_of_record, last_number, replace_element);

  payment_basis_number = element_replacer(number_of_first_сontract, payment_basis_number, replace_contract);
  payment_basis = element_replacer(number_of_first_сontract, payment_basis, replace_contract);
  nature_of_the_operation = element_replacer(number_of_first_сontract,nature_of_the_operation, replace_contract);
  purpose_of_payment = element_replacer(number_of_first_сontract, purpose_of_payment, replace_contract);

  new_ob['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['НомерЗаписи'][0] = number_of_record;

  new_ob['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ОснованиеОп'][1]['НомДок'][0] = payment_basis_number;
  new_ob['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ОснованиеОп'][0]['СодДок'][0] = payment_basis; 
  new_ob['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ХарактерОп'][0] = nature_of_the_operation;
  new_ob['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['НазнПлатеж'][0] = purpose_of_payment;
  build_xml(new_ob, new_file);//namebuilder function); // передаю глабально имя новаого файла
}

function build_xml(input_obj, new_file) {
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(input_obj);
  fs.writeFileSync(__dirname + '/downloads/' + new_file, xml); 

}

function element_replacer(number_of_first_сontract, element_for_replace, replace_contract){
  var new_string =  element_for_replace.replace(number_of_first_сontract, replace_contract);
  return new_string;
}

function replace_contract_maker (n, number_of_first_сontract){
  var first_part = number_of_first_сontract.slice(0, 6);
  var x = number_of_first_сontract.slice(6, -2);
  var y = (Number(x) + n).toString();
  var replace_contract = first_part + y + "ДЛ";
  return replace_contract;
}

function last_messege_number_maker(n, last_number){
  var new_last_number = (n + Number(last_number)).toString();
  return new_last_number;
}

function number_of_record_element_replacer(element_for_replace, last_number, replace_element) {
  var first_part = element_for_replace.slice(0, -8);
  var last_part = element_for_replace.slice(-8);
  last_part = last_part.replace(last_number, replace_element);
  var new_string = first_part + last_part;
  return new_string;
}

module.exports.main_logic = main_logic;