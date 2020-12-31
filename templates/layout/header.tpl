<div class="navbar navbar-default navbar-fixed-top navbar-inverse">
	<div class="container">

		<!-- mobile display -->
		<div class="navbar-header">
			<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
			<span class="sr-only">Toggle navigation</span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			</button>
			<a id="brand" class="navbar-brand">
				<img src="images/logos/helix-digits-mono.svg" />
				<span class="hidden-xs">Morgridge Software Assurance</span>
			</a>
		</div>

		<!-- normal display -->
		<div id="navbar" class="collapse navbar-collapse">

			<!-- standard navbar -->
			<ul class="nav nav-pills navbar-nav">
				<li<% if (nav == 'about') {%> class="active" <% } %>><a id="about"><i class="fa fa-info"></i><label>About</label></a></li>

				<% if (show_contact) { %>
				<li<% if (nav == 'contact') {%> class="active" <% } %>><a id="contact"><i class="fa fa-comment"></i><label>Contact</label></a></li>
				<% } %>
				
				<% if (show_resources) { %>
				<li<% if (nav == 'resources') {%> class="active" <% } %>><a id="resources"><i class="fa fa-book"></i><label>Resources</label></a></li>
				<% } %>

				<% if (show_policies) { %>
				<li<% if (nav == 'policies') {%> class="active" <% } %>><a id="policies"><i class="fa fa-gavel"></i><label>Policies</label></a></li>
				<% } %>

				<% if (show_help) { %>
				<li<% if (nav == 'help') {%> class="active" <% } %>><a id="help"><i class="fa fa-question"></i><label>Help</label></a></li>
				<% } %>
			</ul>

			<!-- compact navbar -->
			<ul class="nav nav-pills navbar-nav hidden-xs hidden-sm hidden-md hidden-lg">
				<li<% if (nav == 'about') {%> class="active" <% } %>><a id="about" data-toggle="popover" data-placement="bottom" data-content="About"><i class="fa fa-info"></i></a></li>

				<% if (show_contact) { %>
				<li<% if (nav == 'contact') {%> class="active" <% } %>><a id="contact" data-toggle="popover" data-placement="bottom" data-content="Contact"><i class="fa fa-comment"></i></a></li>
				<% } %>
				
				<% if (show_resources) { %>
				<li<% if (nav == 'resources') {%> class="active" <% } %>><a id="resources" data-toggle="popover" data-placement="bottom" data-content="Resources"><i class="fa fa-book"></i></a></li>
				<% } %>

				<% if (show_policies) { %>
				<li<% if (nav == 'policies') {%> class="active" <% } %>><a id="policies" data-toggle="popover" data-placement="bottom" data-content="Policies"><i class="fa fa-gavel"></i></a></li>
				<% } %>

				<% if (show_help) { %>
				<li<% if (nav == 'help') {%> class="active" <% } %>><a id="help" data-toggle="popover" data-placement="bottom" data-content="Help"><i class="fa fa-question"></i></a></li>
				<% } %>
			</ul>		

			<ul class="nav nav-pills navbar-nav navbar-right">
				<% if (user) { %>
				<li<% if (nav == 'my-account') {%> class="active" <% } %>><a id="my-account"><i class="fa fa-user"></i>
				<label class="username visible-sm-inline">
					<% if (user.has('username')) { %>
					<%- user.get('username').truncatedTo(9) %>
					<% } %>
				</label>
				<label class="username hidden-sm">
					<% if (user.has('username')) { %>
					<%- user.get('username') %>
					<% } %>
				</label>
				</a></li>
				<% } %>

				<li id="notifications-alert" style="display:none">
					<i class="fa fa-newspaper-o" style="margin:10px"></i>
				</li>

				<div class="navbar-form navbar-right">
					<% if (user) { %>
					<button id="sign-out" class="btn"><i class="fa fa-chevron-left"></i>Sign Out</button>
					<% } else { %>
					<button id="sign-in" type="button" class="btn btn-primary hidden-xs"><i class="fa fa-chevron-right"></i>Sign In</button>
					<% } %>
				</div>
			</ul>
		</div>
	</div>
</div>
