
document.querySelectorAll(".card-small").forEach((item) =>{
        item.addEventListener("click" , (event) =>{
            // Lấy đường dẫn hình ảnh từ phần tử được click
             const imageSrc = event.target.src;
        
            // Gọi hàm để thay đổi hình lớn
            changeImage(imageSrc);
        });
});

function changeImage(imageSrc) {
    document.querySelector("#img-card").src = imageSrc;
}


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

