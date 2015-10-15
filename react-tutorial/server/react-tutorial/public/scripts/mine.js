 var CommentBox = React.createClass({
    getInitialState: function(){
      return{
        data: []
      }
    },
    
    loadCommentsFromServer: function(){
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache:false,
        success: function(data){
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err){
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },

    componentDidMount: function(){
      this.loadCommentsFromServer();
      setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    handleCommentFormSubmit: function(comment){
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: "POST",
        data: comment,
        success: function(data){
          this.setState({data: data})
        }.bind(this),
        error: function(xhr, status, err){
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },

    render: function(){
      return(
        <div className="commentBox">
          <h2>Comment box</h2>
          <CommentList data={this.state.data} />
          <CommentForm handleCommentFormSubmit={this.handleCommentFormSubmit} />
        </div>
      );
    }
});

var CommentList = React.createClass({
    render: function(){
          var commentNodes = this.props.data.map(function (comment, i) {
      return (
        <Comment author={comment.author} key={i}>
          {comment.text}
        </Comment>
      );
    });

      return(
        <div className="commentList">
            {commentNodes}
        </div>
      );
    }
});

var CommentForm = React.createClass({
  handleCommentSubmit: function(e){
    e.preventDefault();
    var author = this.refs.author.value;
    var text = this.refs.text.value;

    if(!author || !text)
      return;

    this.props.handleCommentFormSubmit({author: author, text: text});

    this.refs.author.value = "";
    this.refs.text.value = "";
  },

  render: function(){
    return(
        <form className="commentForm" onSubmit={this.handleCommentSubmit}>
          <input type="text" placeholder="Your name" ref="author" />
          <input type="text" placeholder="Your views" ref="text" />
          <input type="submit" value="Post" />
        </form>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function(){
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return {__html: rawMarkup};
  },

  render: function(){
    return(
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval="2000" />,
  document.getElementById('content')
);