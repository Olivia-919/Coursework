addEventLoad(function () {
  const form = document.getElementById('addTopicForm');
  function fetchTopicServer() {
    fetch('/api/queryTopics', {
      method: 'GET',
    })
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          $('#topic-loading').hide();
          if (!Array.isArray(r.data) || r.data.length === 0) {
            $('#topic-empty-mess').html('<div class="topic-empty">暂无主题</div>')
          } else {
            const cardliststr = r.data.map(item => {
              const ht = $('#oneTopicCardTemplate').html();
              const source = ht.replace(scriptTemplateReg, function (node, key) {
                return {
                  'topicId': item.id,
                  'topicName': item.name,
                  'topicDate': moment.utc(item.gmt_modify).format('YYYY-MM-DD HH:mm:ss'),
                  'topicPerson': item.creator_id
                }[key];
              });
              return source;
            })
            $('#topic-empty-mess').html('');
            $('#topiclist-wrap').html(cardliststr.join(''))
          }
          $('#topic-empty-add').show();
        }
      })
  }
  setTimeout(function () {
    fetchTopicServer();
  }, 1000)

  $("#addTopicModal").on("hidden.bs.modal", function (e) {
    // 清空表单
    $("#topic-name").val("");
    $("#topic-desc").val("");
    $('#addTopic-feedback').html('');
    $("#addTopicSubmitBtn").attr("disabled", false);
  });

  // 登录表单校验
  function validateForm() {
    return new Promise((resolve, reject) => {
      let flag = true;
      if (form.checkValidity() === false) {
        flag = false;
      }

      const nameVal = $("#topic-name").val();

      if (nameVal) {
        $("#topic-name").removeClass("is-invalid");
      } else {
        $("#topic-name").addClass("is-invalid");
        flag = false;
      }

      if (flag) {
        resolve();
      } else {
        reject();
      }
    });
  }
  // 保存主题表单
  $("#addTopicSubmitBtn").click((e) => {
    e.preventDefault();
    validateForm().then(() => {
      $("#addTopicSubmitBtn").attr("disabled", true);
      $("#topic-submit-loading").css("display", "inline-block");
      const f = new FormData(form);

      fetch("/api/addTopic", {
        method: "POST",
        body: f,
        headers: {
          "X-CSRFToken": _token,
        },
      }).then((r) => {
        return r.json()
      }).then(r => {
        $("#topic-submit-loading").css("display", "none");
        // $("#addTopicSubmitBtn").attr("disabled", false);
        if (r.success) {
          $('#addTopic-feedback').html(`<div class="alert alert-success" role="alert">保存成功，自动关闭此弹窗...</div>`);
          setTimeout(() => {
            $("#addTopicModal").modal('hide');
            fetchTopicServer();
          }, 1000)

        } else {
          $('#login-feedback').html(`<div class="alert alert-danger" role="alert">${r.message}</div>`);
        }
      })
    });
  });
  // 打开创建主题 modal
  $('#topic-empty-add').click(function () {
    $("#addTopicModal").modal();
  });
})