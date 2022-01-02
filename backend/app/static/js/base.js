window.onload = function () {
    const form = document.getElementById("loginForm");
    $("#glLoginBtn").click(function () {
      $("#loginModal").modal();
    });

    $("#loginModal").on("hidden.bs.modal", function (e) {
      // 清空表单
      $("#name").val("");
      $("#password").val("");
      $('#login-feedback').html('');
    });

    // 登录表单校验
    function validateForm() {
      return new Promise((resolve, reject) => {
        let flag = true;
        if (form.checkValidity() === false) {
          flag = false;
        }

        const nameVal = $("#name").val();
        const pwdVal = $("#password").val();

        if (nameVal) {
          $("#name").removeClass("is-invalid");
        } else {
          $("#name").addClass("is-invalid");
          flag = false;
        }

        if (pwdVal ) {
          $("#password").removeClass("is-invalid");
        } else {
          $("#password").addClass("is-invalid");
          flag = false;
        }

        if (flag) {
          resolve();
        } else {
          reject();
        }
      });
    }

    // 登录
    $("#modalLoginBtn").click((e) => {
      e.preventDefault();
      validateForm().then(() => {
        $("#modalLoginBtn").attr("disabled", true);
        $("#submit_loading").css("display", "inline-block");
        const f = new FormData(form);
        f.set('remember', $('#remember').get(0).checked);
        fetch("/api/login", {
          method: "POST",
          body: f,
          headers: {
            "X-CSRFToken": _token,
          },
        }).then((r) => {
          return r.json()
        }).then(r => {
          $("#submit_loading").css("display", "none");
          $("#modalLoginBtn").attr("disabled", false);
          if (r.success) {
            $('#login-feedback').html(`<div class="alert alert-success" role="alert">登录成功，正在跳转到首页...</div>`);
            setTimeout(() => {
              // 跳到首页
              window.location.href = '/';
            }, 1500)
            
          } else {
            $('#login-feedback').html(`<div class="alert alert-danger" role="alert">${r.message}</div>`);
          }
        })
      });
    });

    // 注销
    $('#glLogoutBtn').click(() => {
      fetch("/api/logout", {
        method: "POST",
        headers: {
          "X-CSRFToken": _token,
        },
      }).then((r) => {
        return r.json()
      }).then(r => {
        if (r.success) {
          // 跳到首页
          window.location.href = '/';
        }
      })
    })
  };