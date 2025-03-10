// Utility function to get a random number within a range
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Function to create falling hearts animation
function createFallingHearts() {
    setInterval(function () {
        var docHeight = $(document).height();
        var docWidth = $(document).width();
        var startLeft = getRandomArbitrary(0, docWidth);
        var fallDuration = getRandomArbitrary(4000, 6000);
        var opacity = Math.random() * (1 - 0.2) + 0.2;
        var fontSize = getRandomArbitrary(5, 20);
        var endLeft = getRandomArbitrary(startLeft - 100, startLeft + 100);

        var heart = document.createElement("span");
        $(heart).addClass("snow-item fa fa-heart").css({
            'position': "absolute",
            'z-index': "999",
            'color': "#ff0000",
            'display': "block",
            'top': 0,
            'left': startLeft,
            'opacity': opacity,
            'font-size': fontSize + "px",
            'padding': "12px"
        }).appendTo("body").animate({
            'top': docHeight - fontSize,
            'left': endLeft
        }, {
            duration: fallDuration,
            easing: "linear",
            complete: function () {
                $(this).fadeOut("fast", function () {
                    $(this).remove();
                });
            }
        });
    }, 500);
}

// Function to type out the message
const text = document.querySelector('.text-message');
const phrase = text.textContent;
let index = 0;

function typeMessage() {
    if (index <= phrase.length) {
        text.textContent = phrase.slice(0, index);
        index++;
        setTimeout(typeMessage, 100);
    } else {
        // Message typing is complete, show the action buttons
        showActionButtons();
    }
}

// Function to show action buttons
function showActionButtons() {
    const boxAction = document.querySelector('.box-action');
    if (boxAction) {
        boxAction.style.display = 'flex';
        boxAction.style.justifyContent = 'space-around';
        boxAction.style.marginTop = '20px';
    }
}

// Main document ready function
$(document).ready(function () {
    // Hide loading screen
    $("#loading").fadeOut(3000);

    // Password check functionality (NO AJAX)
    $("#btn-matkhau").click(function () {
        let inputPassword = $("#password");
        let text_err = $("#error-mess");

        if (inputPassword.val() === "") {
            inputPassword.focus();
            text_err.html("Bạn ơi quên nhập mật khẩu nè ❤").css("color", "red");
        } else if (inputPassword.val() === "1801") {
            $(".box").fadeOut("fast");
            $(".flower-footer").css("opacity", 1);
            $("#sun").css("opacity", 1);

            setTimeout(() => {
                $("#bee").css({
                    'opacity': 1,
                    'animation-name': "bee_fly",
                    'animation-duration': "10s",
                    'animation-fill-mode': "forwards"
                });
            }, 1000);

            setTimeout(() => {
                $(".letter").show(500, function () {
                    $("#bee").hide("fast");
                });
            }, 10000);

            $(".letter").on('click', function() {
                $(this).fadeOut(500, function() {
                    $(".box2").fadeIn("slow");
                    index = 0; // Reset index before typing
                    typeMessage();
                });
            });

            $("#backgroundAudio")[0].play();
        } else {
            text_err.html("Sai mật khẩu rùi nè.").css("color", "red");
        }
    });

    // Reset error message on password input
    $("#password").keyup(function () {
        $("#error-mess").html("Mật khẩu phải ghi liền không dấu*").css("color", "#979797");
    });

    $(".letter").click(function () {
        $(".letter").hide("fast", function () {
            $(".box2").addClass("animate__backInUp").show(400);
            createFallingHearts()
        });
    });

    function displayCustomImages() {
        const container = document.getElementById('custom-images-container');

        // Đảm bảo container có kích thước
        if (container.offsetWidth === 0 || container.offsetHeight === 0) {
            console.log("Container chưa có kích thước, thử lại sau.");
            setTimeout(displayCustomImages, 100); // Thử lại sau 100ms
            return;
        }

        const containerRect = container.getBoundingClientRect();
        console.log("Container size:", containerRect.width, containerRect.height);

        // Xóa các ảnh cũ nếu cần
        const existingImages = container.querySelectorAll('img');
        if (existingImages.length !== customImages.length) {
            container.innerHTML = '';
        }

        customImages.forEach((image, index) => {
            let img = container.children[index];
            if (!img) {
                img = document.createElement('img');
                img.style.position = 'absolute';
                container.appendChild(img);
            }

            img.src = image.url;

            // Tính toán vị trí dựa trên phần trăm
            const left = image.position.x - containerRect.left;
            const top = image.position.y - containerRect.top;
            img.style.left = `${left}px`;
            img.style.top = `${top}px`;

            // Tính toán kích thước dựa trên kích thước container
            const width = image.size.width;
            const height = image.size.height;

            img.style.width = `${width}px`;
            img.style.height = `${height}px`;
        });
    }

    // Sử dụng ResizeObserver để theo dõi thay đổi kích thước của container
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.contentBoxSize) {
                displayCustomImages();
            }
        }
    });

    // Bắt đầu theo dõi container
    const container = document.getElementById('custom-images-container');
    resizeObserver.observe(container);

    // Gọi hàm khi trang đã tải
    window.addEventListener('load', displayCustomImages);

    // Vẫn giữ event listener cho window resize để xử lý các trường hợp khác
    window.addEventListener('resize', displayCustomImages);

    // Initially hide the action buttons
    const boxAction = document.querySelector('.box-action');
    if (boxAction) {
        boxAction.style.display = 'none';
    }

    // Action buttons functionality
    const saveMessageBtn = document.getElementById('saveMessage');

    saveMessageBtn.addEventListener('click', function() {
        html2canvas(document.querySelector('.box2')).then(canvas => {
            const dataURL = canvas.toDataURL('image/png');
            const senderElement = document.querySelector('.text-end .fw-bold');
            const receiverElement = document.querySelector('.text-start .fw-bold');

            let sender = senderElement ? senderElement.textContent.trim() : 'Unknown';
            let receiver = receiverElement ? receiverElement.textContent.trim() : 'Unknown';

            // Create filename
            const filename = `tu_${sender}_den_${receiver}.png`;
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
});
