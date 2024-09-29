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

const isValid = ({ value, parentNode, funcs, controlNodes }) => {
    //kiểm tra value bằng các hàm trong mảng funcs đi   
    //**Lưu ý phải xài for-of thì mới return và dừng lại được
    for (const checkFunc of funcs) {
        let msg = checkFunc(value);
        if (msg) {//lỗi thì trả ra msg mà msg thì là chuỗi có nd lên true nên làm
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
    let validForm = [
        isValid({
            value: fnameNode.value,
            funcs: [isRequired, isName],
            parentNode: fnameNode.parentElement,
            controlNodes: [fnameNode],
        }),
        isValid({
            value: lnameNode.value,
            funcs: [isRequired, isName],
            parentNode: lnameNode.parentElement,
            controlNodes: [lnameNode],
        }),
        isValid({
            value: emailNode.value,
            funcs: [isRequired, isEmail],
            parentNode: emailNode.parentElement,
            controlNodes: [emailNode],
        }),
        isValid({
            value: phoneNode.value,
            funcs: [isRequired, isPhone],
            parentNode: phoneNode.parentElement,
            controlNodes: [phoneNode],
        }),
        isValid({
            value: messageNode.value,
            funcs: [isRequired, min(10), max(40)],
            parentNode: messageNode.parentElement,
            controlNodes: [messageNode],
        }),
    ];
    // //ngăn sự kiện load lại mất nội dung trước
    // event.preventDefault();
    
    //lấy thông tin từ các ô input
    let fname = document.querySelector("#fname").value;
    let lname = document.querySelector("#lname").value;
    let message = document.querySelector("#message").value;
    //đúc ra customer mới
    let newCustomer = new Customer(fname + " " + lname, message);
    //tạo ra anh điều khiển trên ls
    let store = new Store();
    //tạo ra anh hiển thị trên UI
    let ui = new RenderUI();

    let checkValidForm = validForm.every((item) => {
        return item == "";
    });
    if(checkValidForm){
        //thêm vào ls trước
        store.add(newCustomer);
        //thêm vào ui
        ui.add(newCustomer);
        //hiển thị thông báo alert
        ui.alert(`Add form ${newCustomer.name} success`);
    }else{
        ui.alert(`Form không hợp lệ!`, type = `dark`);
    };
});

//Mình sẽ nâng cấp thêm cho các ô fname, lname, email, phone thì bắt buộc nhập, nếu mà không nhập cũng coi như lỗi
//còn message thì không cần
//dom tới tất cả tụi nó
document.querySelectorAll(".input-prevent-empty").forEach((item) => {
    item.addEventListener("blur", (event) => {
        if (event.target.value == "" && !event.target.classList.contains("is-invalid")) {//nghĩa là nếu không nhập gì và cũng không báo đỏ thì mới làm
            createMsg(event.target.parentNode, [event.target], "that field is required!");
        };
    });
});

//sự kiện khi có gõ gì vào thì mình sẽ xóa đi cái đỏ đỏ nhé
document.querySelectorAll(".input-prevent-empty").forEach((item) => {
    item.addEventListener("input", (event) => {
        if (event.target.value != "" || event.target.value != null) {//nếu có nội dung gì đó thì là true mà true thì làm
            //xóa cái class is-invalid cho nó hết đỏ đi
            event.target.classList.remove("is-invalid");
            //xóa cái div thông báo ở dưới
            if(event.target.nextElementSibling){//có thì mới xóa
                event.target.nextElementSibling.remove();
            }
        };
    });
});

//------------------------------------------------------------------------------------------------//
// Chức năng hiển thị feedback lên web
//tạo class cho Customer để tạo ra các customer
//tụi tui k có dùng class => function constructor
function Customer(name, message) {
    this.name = name;
    this.message = message;
    this.id = new Date().toISOString();
};

//----------------Store---------------
function Store() { };
//Store chuyên tạo ra những object có method quản lí localStorage
//.getCustomers(): lên ls lấy danh sách các customers về
Store.prototype.getCustomers = function () {
    return JSON.parse(localStorage.getItem("customers")) || [];
};

//.add(student): lưu customer vào localStorage
Store.prototype.add = function (customer) {
    //lấy danh sách từ localStorage xuống
    let customers = this.getCustomers();
    //thêm customer vào mảng
    customers.push(customer);
    //tải lên lại LS
    localStorage.setItem("customers", JSON.stringify(customers));
};

//----------------RenderUI---------------
function RenderUI() { };
//RenderUI chuyên tạo ta object có method quản lí UI
//.add(customer) thêm student vào giao diện
RenderUI.prototype.add = function ({id, name, message }) {
    //mình phải lấy danh sách từ localStorage xuống để hiển thị thứ tự
    //tạo ra object quản lí LS
    let store = new Store();
    //lấy danh sách về
    let customers = store.getCustomers();
    //tạo ra phần tử ảo và bỏ các thông tin vào
    let newCustomer = document.createElement("tr");
    //nhét thông tin vào cho nó
    newCustomer.innerHTML = `
                        <td>${customers.length}</td>
                        <td>${name}</td>
                        <td>
                            ${message}
                        </td>
                        <td>
                            <button  data-id="${id}" class="btn btn-danger btn-remove">Remove</button>
                        </td>
                                                    `;
    //nhét phần tử mới tạo vào cuối 
    document.querySelector("tbody").appendChild(newCustomer);
    //xóa value cho các ô nhập
    document.querySelector("#fname").value = "";
    document.querySelector("#lname").value = "";
    document.querySelector("#message").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#phone").value = "";
};
//.alert(msg, type = "success"): nhận vào msg và hiển thị lên giao diện
//      nếu em k truyền type thì mặc định là success => màu xanh
//      nếu em truyền type thì mình hiện thị theo màu

RenderUI.prototype.alert = function (msg, type = "success") {
    let divAlert = document.createElement("div");
    //thêm nội dung vào cho nó
    divAlert.innerHTML = msg;
    //thêm class cho nó
    divAlert.className = `alert alert-${type} text-center`;
    //nhét nó vào trong div thông báo
    document.querySelector(".notification").appendChild(divAlert);
    //hiển thị 2s xong rồi xóa luôn
    setTimeout(() => {
        divAlert.remove()
    }, 2000);
};

//hàm init(): giúp lấy dữ liệu trong ls và hiển thị để nhằm control R thì sẽ không bị mất
RenderUI.prototype.init = function () {
    //lấy danh sách từ localStorage nên phải tạo ra object ls
    let store = new Store();
    //lấy danh sách về
    let customers = store.getCustomers();
    //tạo ra anh quản lí UI
    let ui = new RenderUI();
    //chạy for và hiển thị lên UI
    customers.forEach((item, key) =>{
        //mình phải lấy danh sách từ localStorage xuống để hiển thị thứ tự
        //tạo ra phần tử ảo và bỏ các thông tin vào
        let newCustomer = document.createElement("tr");
        //nhét thông tin vào cho nó
        newCustomer.innerHTML = `
                            <td>${key + 1}</td>
                            <td>${item.name}</td>
                            <td>
                                ${item.message}
                            </td>
                            <td>
                                <button  data-id="${item.id}" class="btn btn-danger btn-remove">Remove</button>
                            </td>
                                                        `;
        //nhét phần tử mới tạo vào cuối 
        document.querySelector("tbody").appendChild(newCustomer);
        //xóa value cho các ô nhập
        document.querySelector("#fname").value = "";
        document.querySelector("#lname").value = "";
        document.querySelector("#message").value = "";
        document.querySelector("#email").value = "";
        document.querySelector("#phone").value = "";
    });
}


//-----------------main flow------------
//render lại lấy từ ls ra để k bị mất nd
//render là để lúc nào mình ctrl R lại là nó lấy ra hiển thị lại
//chứ nếu bỏ nó vào sự kiện thì k lẽ sự kiện diễn ra mới lấy ra để hiển thị thì nó k hợp lí

//**Khi tất cả code đã xong thì mới render ra 
document.addEventListener("DOMContentLoaded", (event) => {
    let ui = new RenderUI();
    ui.init();
});

//flow xóa các feedback đi
//mình sẽ dom vào form luôn coi thử coi nếu click vào
//mà có dính cái nút thì xóa
document.querySelector("tbody").addEventListener("click", (event) => {
    if(event.target.classList.contains("btn-remove")){
        //lấy key của nó
        let key = event.target.dataset.id;
        //tạo ra anh quản lí ui
        let ui = new RenderUI();
        //tạo ra anh quản lí store
        let store = new Store();
        //lấy danh sách các item về
        let customers = store.getCustomers();
        //hiện con thông báo xác nhận coi có muốn xóa không
        let isConfirmed = confirm(`Do you want delete feedback: No${event.target.parentElement.parentElement.children[0].textContent}`);
        if(isConfirmed){
            //xóa item trên UI
            event.target.parentElement.parentElement.remove();
            //xóa item trên localStorage
            //duyệt qua mảng coi có th nào có id giống key thì xóa
            customers = customers.filter((item) => {
                return item.id != key;
            });
            //lưu lại lên localStorage
            localStorage.setItem("customers", JSON.stringify(customers));
        };
    };
});

//**Giúp cho trang web chuyển mượt hơn
window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href
    }, 1000)
};

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
});
// ------------------------------------------------------------