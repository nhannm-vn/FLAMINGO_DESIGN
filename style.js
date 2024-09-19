//hàm giúp đổi src ảnh
function changeImage(element, newSrc) {
    element.src = newSrc;
}

function resetImage(element, originalSrc) {
    element.src = originalSrc;
}

//các chức năng giúp chặn người dùng nhập láo(FORM VALIDATE)
//rule:
//Form validate project
/*
name: isRequired isName
email: isRequired isEmail
phone: isRequired, isPhone: chỉ toàn số và có độ dài 10 hoặc 11
message: isRequired min(10) max(40)
*/
const REG_EMAIL =
  /^[a-zA-Z\d\.\-\_]+(\+\d+)?@[a-zA-Z\d\.\-\_]{1,65}\.[a-zA-Z]{1,5}$/;
const REG_NAME =
  /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+((\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)+)?$/;
const REG_PHONE = /^[0]\d{9,10}$/;

//Viết cho nó các hàm để cho từng nhu cầu chặn để sử dụng cấu trúc Observer Design Pattern
//Quy tắt của một hàm là nhận vào kiểm tra xem có đúng với yêu cầu không, nếu không đúng yêu cầu
//thì trả ra false còn đúng thì trả ra "", như vậy sẽ giống đồng nhất trong việc xài kiến trúc
/*
fname: isRequired, isName
lname: isRequired, isName
email: isRequired, isEmail
phone: isRequired, isPhone
message: isRequired, min(10), max(40)
*/

//isRequired(value)
//Hàm nhận vào value và kiểm tra xem có bỏ trống hay không?
//Nếu bỏ trống thì trả ra câu chửi còn valid thì trả rã ""
//Nhưng ngoài việc bỏ trống còn xét xem nó có là null không
//vì đối với những loại checkbox tick vào thì không tích là null và null cũng coi
//như là bỏ trống

const isRequired = (value) => (value ? "" : "that field is required!");

//Các hàm isName, isEmail, isPhone lần lượt kiểm tra xem dữ liệu có match với regex hay không
const isName = (value) => (REG_NAME.test(value) ? "" : "Name is invalid!");
const isEmail = (value) => (REG_EMAIL.test(value) ? "" : "Email is invalid!");
const isPhone = (value) => (REG_PHONE.test(value) ? "" : "Phone is invalid!");

//Hàm min max nhận vào một numberBound kiểm tra xem độ dài có đủ yêu cầu chưa, nếu đủ rồi thì trả ra chuỗi rỗng còn chưa thì trả ra câu chửi
const min = (numberBound) => (value) => (value.length >= numberBound ? "" : `Min is ${numberBound}!`);

const max = (numberBound) => (value) => (value.length <= numberBound ? "" : `Max is ${numberBound}!`);

//viết thử một object gồm 4 thuộc tính, 2 thuộc tính dùng để check lỗi, 2 cái dùng để hiển thị lỗi
//dom thử
// let fnameNode = document.querySelector("#fname");
/*
value: fnameNode.value  /lấy ra value để check cho các hàm
funcs: isRequired, isName  /các hàm dùng để kiểm tra valid cho fname
parentNode: fnameNode.parentElement  /dùng để nhìn lên cha và nhét câu lỗi vào dưới dùng div cha
controlNodes: [fnameNode]  /các chỗ input dùng để nhét class vào cho nó hiện lỗi đỏ lên, vì có khi có tới nhiều chỗ cần đỏ nên truyền mảng
*/

//hàm tạo ra lỗi
const createMsg = (parentNode, controlNodes, msg) => {
    //tạo ra cái div ảo chứa câu chửi
    let invalidDiv = document.createElement("div");
    //nhét msg câu lỗi vào trong div đó
    invalidDiv.innerHTML = msg;
    //nhét class vào trong div chứa câu chửi cho nó đỏ xè lên
    invalidDiv.classList.add("invalid-feedback");
    //nhét câu div vào phía dưới cùng cha của input đó để có câu chửi
    parentNode.appendChild(invalidDiv);
    //thêm lần lượt class vào cho các ô input để nó báo đỏ lên
    //các chỗ cần báo đỏ đã được lưu vào controlNodes
    controlNodes.forEach((inputNode) => {
        inputNode.classList.add("is-invalid");
    });
};

//test thử hàm đi
// let fnameNode = document.querySelector("#fname");
// createMsg(fnameNode.parentElement, [fnameNode], "chí pủ");

//hàm isValid({}): nhận vào đầy đủ 4 thuộc tính của object dùng để
//kiểm tra thử xem là value có valid bằng funcs không. Nếu không valid
//thì hiện lỗi bằng parentNode và controlNodes. Lưu ý nếu có lỗi thì mình sẽ dừng
//hẳn luôn để không nó hiện nhiều quá. Và nếu lỗi thì trả ra cái lỗi đó, còn không lỗi
//thì mình trả ra "" cho nó => nhằm giúp mình check khi nào thì form valid toàn bộ

const isValid = ({value, parentNode, funcs, controlNodes}) => {
    //kiểm tra value bằng các hàm trong mảng funcs đi   
    //**Lưu ý phải xài for-of thì mới return và dừng lại được
    for (const checkFunc of funcs) { 
        let msg = checkFunc(value);
        if(msg){//lỗi thì trả ra msg mà msg thì là chuỗi có nd lên true nên làm
            createMsg(parentNode, controlNodes, msg);
            return msg;//tạo ra cái lỗi xong dừng lại luôn và trả ra con lỗi đó
        };
    };
    //nếu không có lỗi thì trả ra ""
    return "";
};

//hàm xóa lỗi
const clearMsg = () => {
    //xóa luôn cái div chứa lỗi
    //dom tới các cái input có chứa class is-invalid và xóa class cho ô input
    document.querySelectorAll(".is-invalid").forEach((inputNode) => {
        inputNode.classList.remove("is-invalid");
    });
    //xóa tất cả các div có chứa class invalid-feedback
    document.querySelectorAll(".invalid-feedback").forEach((item) => {
        item.remove();
    });
};

//test
// let fnameNode = document.querySelector("#fname");
// isValid({
//     value: fnameNode.value,
//     parentNode: fnameNode.parentElement,
//     funcs: [isRequired, isName],
//     controlNodes: [fnameNode],
// });

//Mình sẽ nâng cấp thêm cho các ô fname, lname, email, phone thì bắt buộc nhập, nếu mà không nhập cũng coi như lỗi
//còn message thì không cần
//dom tới tất cả tụi nó
document.querySelectorAll(".input-prevent-empty").forEach((item) => {
    item.addEventListener("blur", (event) => {
        if(!event.target.value && !event.target.classList.contains("is-invalid")){//nghĩa là nếu không nhập gì và cũng không báo đỏ thì mới làm
            createMsg(event.target.parentNode, [event.target], "that fields is required");
        };
    });
});

//sự kiện khi có gõ gì vào thì mình sẽ xóa đi cái đỏ đỏ nhé
document.querySelectorAll(".input-prevent-empty").forEach((item) => {
    item.addEventListener("input", (event) => {
        if(event.target.value != "" || event.target.value != null){//nếu có nội dung gì đó thì là true mà true thì làm
            //xóa cái class is-invalid cho nó hết đỏ đi
            event.target.classList.remove("is-invalid");
            //xóa cái div thông báo ở dưới
            event.target.nextElementSibling.remove();
        };
    });
});

//bắt sự kiện submit chính Main Flow
//bắt sự kiện của form luôn
document.querySelector("form").addEventListener("submit", (event) => {
    //khi submit tải lại trang thì mình ngăn load lại để mất nội dung
    event.preventDefault();
    //xóa các lỗi cũ đã
    clearMsg();
    //dom tới các ô input
    const fnameNode = document.querySelector("#fname");
    const lnameNode = document.querySelector("#lname");
    const emailNode = document.querySelector("#email");
    const phoneNode = document.querySelector("#phone");
    const messageNode = document.querySelector("#message");

    //kiểm tra từng thằng valid thông qua các hàm của nó
    isValid({
        value: fnameNode.value,
        funcs: [isRequired, isName],
        parentNode: fnameNode.parentElement,
        controlNodes: [fnameNode],
    });
    isValid({
        value: lnameNode.value,
        funcs: [isRequired, isName],
        parentNode: lnameNode.parentElement,
        controlNodes: [lnameNode],
    });
    isValid({
        value: emailNode.value,
        funcs: [isRequired, isEmail],
        parentNode: emailNode.parentElement,
        controlNodes: [emailNode],
    });
    isValid({
        value: phoneNode.value,
        funcs: [isRequired, isPhone],
        parentNode: phoneNode.parentElement,
        controlNodes: [phoneNode],
    });
    isValid({
        value: messageNode.value,
        funcs: [isRequired, min(10), max(40)],
        parentNode: messageNode.parentElement,
        controlNodes: [messageNode],
    });
});


