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
        var self = this
            dropZone = self.config.dropZone;

        // When connect-element is clicked,
        // login using Trello API popup
        $("#connect-link").click( function() {
            Trello.authorize({
                type: "popup",
                success: self.onAuthorize
            })
        });

        // When clicking disconnect-element,
        // log out from the Trello API
        $("#disconnect").on("click", self.logout);

        // When a board is selected,
        // show the help for importing the board
        $("#board-list").on("change", "#board-list-select", function(e) {
            var selected = $(this).find("option:selected"),
                board_id = selected.attr("id"),
                board_name = selected.html();
                board_url = selected.data("url");


            // Get list list for board
            self.config.openSelectedList[0].href = board_url + "/profile";
            self.config.selectedListName.text(board_name);
            self.config.upload.show(); 
        });

        dropZone[0].addEventListener('dragover', self.handleDragOver, false);
        dropZone[0].addEventListener('drop', self.handleFileDrop, false);
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
            var tmpl_source = self.config.boardListTmpl.html();  // Get template
                tmpl = Handlebars.compile(tmpl_source);  // Compile template
            self.config.boardList.html( tmpl( {boards: boards} ) );  // Render template
        });

    },

    /*
     * Logs the user out using the Trello API, and updates the logged-in status
     *
     */
    logout: function() {
        Trello.deauthorize();
        TrelloStats.updateLoggedIn();
    },

    /*
     * When a file is dropped, parse the event data to get the JSON object for the board
     * Only the first file is parsed. The rest is ignored.
     */
    handleFileDrop: function( evt ) {
        var self = TrelloStats;
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.
        var file = files[0];
        var reader = new FileReader();

        // Create a closure for reading the file data
        reader.onload = (function (theFile) {
            return function(e) {
                // Reads the file data
                var board = $.parseJSON( e.target.result );
                console.log("Board: ", board); 
                self.parseBoard( board );
                // board.actions.0.data.text;
            };
        })( file );


        // Read the first dropped file
        reader.readAsText( file );
    },

    /* 
     * Handle drag events
     *
     */
    handleDragOver: function( evt ) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    },

    /*
     * Parse board object for data
     *
     */
    parseBoard: function( board ) {
        var self = this,
            stats = {};

        // Contains all actions that are comments starting with "Pomodoro #"
        var pomodoros = $.grep( board.actions, function( action ) {
            return action.type == "commentCard" && 
                   action.data.text.substr(0, 10) == "Pomodoro #"
        });

        // Get total amount of pomodoros
        stats['pomodoroAmount'] = pomodoros.length;


        // Pass statistics to template, and render it
        var tmpl_source = self.config.resultsTmpl.html();  // Get template
            tmpl = Handlebars.compile(tmpl_source);  // Compile template
        self.config.results.html( tmpl({
                stats: stats,
                board: board
            })
        );  // Render template

    }
};

