addEventLoad(function() {
  function fetchTopicServer() {
    const queryId = getQueryVariable('id');
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
            $('#topic-empty-add').show();
            $('#topic-empty-mess').html('');
            $('#topiclist-wrap').html(cardliststr.join(''))
          }
          // 打开创建主题 modal
          $('#topic-empty-add').click(function () {
            $("#addTopicModal").modal();
          });
        }
      })
      .catch(error => {
        $('#topic-loading').hide();
      })
  }
  setTimeout(function () {
    fetchTopicServer();
  }, 1000)
});