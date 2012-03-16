/* 
NOTE: The Trello client library has been included as a Managed Resource.  To include the client library in your own code, you would include jQuery and then

<script src="https://api.trello.com/1/client.js?key=your_application_key">...

See https://trello.com/docs for a list of available API URLs

The API development board is at https://trello.com/api

The &dummy=.js part of the managed resource URL is required per http://doc.jsfiddle.net/basic/introduction.html#add-resources
*/

var TrelloStats = {
    init: function(config) {
        self = this;

        this.config = {};
        $.extend(this.config, config);

        Trello.authorize({
            interactive:false,
            success: self.onAuthorize
        });

        $("#connectLink").click( function() {
            Trello.authorize({
                type: "popup",
                success: self.onAuthorize
            })
        });

        $("#disconnect").click(self.logout);
    },

    updateLoggedIn: function() {
        var isLoggedIn = Trello.authorized();
        $("#loggedout").toggle(!isLoggedIn);
        $("#loggedin").toggle(isLoggedIn);        
    },

    onAuthorize: function() {
        self = TrelloStats;

        self.updateLoggedIn();
        self.getName();
        self.getBoards();

    },

    getName: function() {
        Trello.members.get("me", function(member){
            $("#fullName").text(member.fullName);
        });
    },

    getBoards: function() {
            self = this;
            $("<div>")
                .text("Loading...")
                .appendTo(self.config.boardList);

            // Get the list of boards this user has
            Trello.get("members/me/boards", function( boards ) {
                var tmpl_source = self.config.boardListTmpl.html();
                    tmpl = Handlebars.compile(tmpl_source);
                self.config.boardList.html( tmpl( {boards: boards} ) );
                console.log(boards[0])
            });
    },

    logout: function() {
        Trello.deauthorize();
        TrelloStats.updateLoggedIn();
    }

};

