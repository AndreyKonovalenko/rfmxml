var fs = require('fs'),
    xml2js = require('xml2js'),
    util = require('util');

var filename = 'FM01_1_7703047975770301001_20160316_0100000034.xml';

var message_quantity = 5;
var parser = new xml2js.Parser();

function main_logic(filename, message_quantity){
  for (var i = 1; i <= message_quantity; i++) {
    var new_file_name = filename_builder(i, filename); // глобально передаю имя сгерерированного файла
    console.log(new_file_name);
    //var predacha = {['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ХарактерОп'][0]};
    fs.readFile(__dirname + '/uploads/' + filename, function(err, data) {  // Думаю из- за того что xml2js выполняется асихнронно
      parser.parseString(data, function (err, result) {
          console.log(util.inspect(result, {depth: null}));
          console.log(typeof result);
          my_tag(result, new_file_name);
          console.log('Done');
      });
    });
  }
}
// работает воред




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
  if (my_arr[1] < 100) {
    new_name += '0' + (my_arr[1] + i).toString() + '.xml';
  }else {
    new_name += (my_arr[1] + i).toString() + '.xml';
  }
  return new_name;
}



function my_tag(input, new_file) {
  var result = {},
      new_ob = {};
  result = input['Сбщ110Операции']['ИнформЧасть'][0]['Операция'][0]['ХарактерОп'][0];
  result += " мои изменения";
  console.log(typeof result);
  console.log(result);
  var new_ob = input;
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



