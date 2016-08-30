var fs = require('fs'),
    xml2js = require('xml2js'),
    util = require('util');

var filename = 'FM01_1_7703047975770301001_20160316_0100000034.xml';

var message_quantity = 1;
var parser = new xml2js.Parser();

function main_logic(filename, message_quantity){
  for (var i = 1; i <= message_quantity; i++) {
    var new_file_name = filename_builder(i, filename); // глобально передаю имя сгерерированного файла
    console.log(new_file_name);
    var data = fs.readFileSync(__dirname + '/uploads/' + filename);
    parser.parseString(data, function (err, result) {
      console.log(util.inspect(result, {depth: null}));
      console.log(typeof result);
      my_tag(result, new_file_name);
      console.log('Done');
      });
    };
}

function filename_parser(file){
  var firstpart = file.slice(0, -4); // slice .xml
  var today_mess_num = Number(firstpart.slice(-3)); // -номер последнего соообщеня сегодня;
  var new_mess_firstpart = firstpart.slice(0, -3); //slice 034
  return [firstpart, today_mess_num, new_mess_firstpart];
// test
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



function my_tag(input, new_file) { // это функцая должна модифицирова ть xml file
  var result = {},
      new_ob = input;
  result = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ХарактерОп'][0]; // equal zn
  result += " мои изменения";
  console.log(typeof result);
  console.log(result);

  var nuber_of_record = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['НомерЗаписи'][0];

  var payment_basis_number = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ОснованиеОп'][1]['НомДок'][0];
  var payment_basis = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ОснованиеОп'][0]['СодДок'][0];
  var nature_of_the_operation = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ХарактерОп'][0];
  var purpose_of_payment = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['НазнПлатеж'][0];
  
  console.log(nuber_of_record);
  console.log(payment_basis_number);
  console.log(payment_basis);
  console.log(nature_of_the_operation);
  console.log(purpose_of_payment);

  // записали изиененнай таг
  new_ob['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ХарактерОп'][0] = result;
  console.log(util.inspect(new_ob, {depth: null}));
  // filename constructor
  build_xml(new_ob, new_file);//namebuilder function); // передаю глабально имя новаого файла
}

function build_xml(input_obj, new_file) {
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(input_obj);
  fs.writeFileSync(__dirname + '/downloads/' + new_file, xml); 
  console.log(xml);
  console.log(typeof xml);
}




main_logic(filename, message_quantity);



