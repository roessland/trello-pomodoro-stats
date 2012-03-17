/*
 * TrelloStats
 *
 * A pomodoro statistics generator for Trello
 *
 * Author:    Andreas Røssland <andreas@roessland.com>
 *
 * Live demo: http://roessland.com/trello-pomodoro-stats
 *
 * Source:    https://github.com/andross/trello-pomodoro-stats
 *
 */

var TrelloStats = {

    /*
     * Initalizes config and does stuff
     *
     * Connects to Trello API and initalizes events
     *
     */
    init: function(config) {
        var self = this;

        this.config = {};
        $.extend(this.config, config);

        Trello.authorize({
            interactive:false,
            success: self.onAuthorize
        });

        // Initialize events
        this.events();
    },

    /*
     * This function initializes events for the page.
     *
     * #connect-link: connect to Trello
     * #disconnect: log out
     * #board-list #board-list-select: get lists for board
     * #list-list #list-list-select: analyze selected list
     *
     */
    events: function() {
        self = this; 

        // Connects to Trello using the JS API
        $("#connect-link").click( function() {
            Trello.authorize({
                type: "popup",
                success: self.onAuthorize
            })
        });

        // Logs out from the Trello API
        $("#disconnect").on("click", self.logout);

        // Gets the lists for the selected board
        $("#board-list").on("change", "#board-list-select", function(e) {
            var selected = $(this).find("option:selected"),
                board_id = selected.attr("id"),
                board_name = selected.html();

                // Get list list for board
                self.getLists(board_id);
        });

        // Opens the help-page for importing a list when selected
        $("#list-list").on("change", "#list-list-select", function(e) {
            var selected = $(this).find("option:selected"),
                list_id = selected.attr("id"),
                list_name = selected.html();

            self.config.upload.show(); 
                
        });

    },

    /*
     * Updates or hides the logged-in status, by toggling two divs
     *
     */
    updateLoggedIn: function() {
        var isLoggedIn = Trello.authorized();
        $("#loggedout").toggle(!isLoggedIn);
        $("#loggedin").toggle(isLoggedIn);        
    },

    /*
     * Runs when authorized by Trello API.
     *
     * Updates login status, gets user name, and gets user boards 
     *
     */
    onAuthorize: function() {
        var self = TrelloStats;

        self.updateLoggedIn();
        self.getName();
        self.getBoards();

    },

    /*
     * Gets the full name of the user, and puts it in a container 
     *
     */
    getName: function() {
        Trello.members.get("me", function(member){
            $("#user-fullname").text(member.fullName);
        });
    },

    /*
     * Gets the boards for a user, and prints a <select>-form in the
     * boardList container from the config.
     *
     */
    getBoards: function() {
        var self = this;

        // Add loading text
        $("<div>")
            .text("Loading boards...")
            .appendTo(self.config.boardList);

        // Get the list of boards this user has, and put it in a select list
        Trello.get("members/me/boards", function( boards ) {
            var tmpl_source = self.config.boardListTmpl.html();
                tmpl = Handlebars.compile(tmpl_source);
            self.config.boardList.html( tmpl( {boards: boards} ) );
        });

    },

    /*
     * Get the lists for a board, and render it into a select list
     *
     */
    getLists: function(board_id) {

        var self = this;
        $("<div>")
            .text("Loading lists...")
            .appendTo(self.config.listList);

        // Get the list of boards this user has
        Trello.get("boards/" + board_id + "/lists", function( lists ) {
            var tmpl_source = self.config.listListTmpl.html();
                tmpl = Handlebars.compile(tmpl_source);
            self.config.listList.html( tmpl( {lists: lists} ) );
        });
    },

    getCards: function(list_id) {
        var self = this;
        $(".stats .loading").toggle();

        Trello.get("lists/" + list_id + "/cards", function( cards ) {
            self.debug(cards[1].id);
            console.log(cards[1].id);
        });

                
    },

    debug: function(card_id) {
        Trello.get("cards/" + card_id + "/actions/commentCard", function( card ) {
            console.log(card);
        })
    },

    /*
     * Logs the user out using the Trello API, and updates the logged-in status
     *
     */
    logout: function() {
        Trello.deauthorize();
        TrelloStats.updateLoggedIn();
    }

};

