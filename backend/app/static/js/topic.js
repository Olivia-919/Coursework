addEventLoad(function() {
  const form = document.getElementById('addClaimForm');
  const queryId = getQueryVariable('id');
  function fetchTopicServer() {
    if (queryId === false) {
      return false;
    }
    fetch(`/api/topic?id=${queryId}`, {
      method: 'GET',
    })
      .then(r => r.json())
      .then(r => {
        if (r.success) {
          $('#topic-loading').hide();
          $('#add-claim-btn').show();
          if (!r.data) {
            $('#topic-empty-mess').html('<div class="topic-empty">暂无主题</div>')
          } else {
            // 详情
            const { data } = r;
            const { children } = data;
            const ht = $('#topic-detail-template').html();
            const htSource = ht.replace(scriptTemplateReg, function (node, key) {
              return {
                'topicName': data.name,
                'topicDesc': data.desc,
                'topicDate': moment.utc(data.gmt_modify).format('YYYY-MM-DD HH:mm:ss'),
                'topicCreator': data.creator_id
              }[key];
            });
            $('#topic-detail-cnt').html(htSource);

            // 声明列表
            if (!Array.isArray(children) || children.length === 0) {
              $('#claims-list').html('');
            } else {
              const cardliststr = children.map(item => {
                const ht = $('#topic-claims-template').html();
                const source = ht.replace(scriptTemplateReg, function (node, key) {
                  return {
                    'claimId': item.id,
                    'claimName': item.name,
                    'claimReplyCount': item.replyCount,
                    'claimDate': moment.utc(item.gmt_modify).format('YYYY-MM-DD HH:mm:ss'),
                    'claimCreator': item.creator_id,
                    'claimContent': item.content
                  }[key];
                });
                return source;
              })
              $('#claims-list').html(cardliststr.join(''))
            }
            
            $('#topic-empty-mess').html('');
          }
        }
      })
      .catch(error => {
        console.error(error);
        $('#topic-loading').hide();
      })
  }
  setTimeout(function () {
    fetchTopicServer();
  }, 500)

  // 登录表单校验
  function validateForm() {
    return new Promise((resolve, reject) => {
      let flag = true;
      if (form.checkValidity() === false) {
        flag = false;
      }
      const nameVal = $("#claim-name").val();
      if (nameVal) {
        $("#claim-name").removeClass("is-invalid");
      } else {
        $("#claim-name").addClass("is-invalid");
        flag = false;
      }
      if (flag) {
        resolve();
      } else {
        reject();
      }
    });
  }
  // 发表声明表单
  $("#addClaimSubmitBtn").click((e) => {
    e.preventDefault();
    validateForm().then(() => {
      $("#addTopicSubmitBtn").attr("disabled", true);
      $("#topic-submit-loading").css("display", "inline-block");
      const f = new FormData(form);
      f.set('topicId', queryId);
      fetch("/api/addClaim", {
        method: "POST",
        body: f,
        headers: {
          "X-CSRFToken": _token,
        },
      })
      .then((r) => r.json())
      .then(r => {
        $("#topic-submit-loading").css("display", "none");
        // $("#addTopicSubmitBtn").attr("disabled", false);
        if (r.success) {
          $('#addClaim-feedback').html(`<div class="alert alert-success" role="alert">保存成功，自动关闭此弹窗...</div>`);
          setTimeout(() => {
            $("#addClaimModal").modal('hide');
            fetchTopicServer();
          }, 1000)

        } else {
          $('#addClaim-feedback').html(`<div class="alert alert-danger" role="alert">${r.message}</div>`);
        }
      })
    });
  });

  $("#addClaimModal").on("hidden.bs.modal", function (e) {
    // 清空表单
    $("#claim-name").val("");
    $("#topic-desc").val("");
    $("#claim-name").removeClass("is-invalid");
    $('#addClaim-feedback').html('');
    $("#addClaimSubmitBtn").attr("disabled", false);
  });
  $('#add-claim-btn').click(function() {
    $("#addClaimModal").modal();
  });
});