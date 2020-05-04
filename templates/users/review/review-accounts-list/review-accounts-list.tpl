<thead>
	<tr>
		<th class="username">
			<i class="fa fa-laptop"></i>
			<span>Username</span>
		</th>

		<th class="name">
			<i class="fa fa-font"></i>
			<span>Name</span>
		</th>

		<th class="affiliation hidden-md hidden-sm hidden-xs">
			<i class="fa fa-institution"></i>
			<span>Affiliation</span>
		</th>

		<% if (showType) { %>
		<th class="type hidden-md hidden-sm hidden-xs">
			<i class="fa fa-group"></i>
			<span>Type</span>
		</th>
		<% } %>

		<% if (showForcePasswordReset && !application.config.ldap_readonly) { %>
		<th class="force-password-reset condensed hidden-sm hidden-xs">
			<i class="fa fa-refresh" data-toggle="tooltip" title="Force Password Reset" data-container="body"></i>
			<input type="checkbox" class="select-all" <% if (application.config.ldap_readonly) { %> disabled<% } %>/>
		</th>
		<% } %>

		<% if (showHibernate && !application.config.ldap_readonly) { %>
		<th class="hibernate condensed hidden-sm hidden-xs">
			<i class="fa fa-bed" data-toggle="tooltip" title="Hibernating / Inactive"></i>
			<input type="checkbox" class="select-all" />
		</th>
		<% } %>

		<% if (showLinkedAccount) { %>
		<th class="has-linked-account condensed hidden-sm hidden-xs">
			<i class="fa fa-link" data-toggle="tooltip" title="Has Linked Account"></i>
		</th>
		<% } %>

		<% if (showStats) { %>

		<% if (showNumPackages) { %>
		<th class="num-packages condensed hidden-xs">
			<i class="fa fa-gift" data-toggle="tooltip" title="Num Packages"></i>
		</th>
		<% } %>

		<% if (showNumProjects) { %>
		<th class="num-projects condensed hidden-xs">
			<i class="fa fa-folder" data-toggle="tooltip" title="Num Projects"></i>
		</th>
		<% } %>

		<% if (showNumRuns) { %>
		<th class="num-runs condensed hidden-xs">
			<i class="fa fa-check" data-toggle="tooltip" title="Num Runs"></i>
		</th>
		<% } %>
		
		<% if (showNumResults) { %>
		<th class="num-results condensed hidden-xs">
			<i class="fa fa-bug" data-toggle="tooltip" title="Num Results"></i>
		</th>
		<% } %>

		<% if (showSuccessRate) { %>
		<th class="success-rate condensed hidden-xs">
			<i class="fa fa-smile-o" data-toggle="tooltip" title="Success Rate"></i>
		</th>
		<% } %>

		<% } %>

		<th class="create-date hidden-xxs">
			<i class="fa fa-calendar"></i>
			<span>Create Date</span>
		</th>

		<th class="last-login-date hidden-md hidden-sm hidden-xs">
			<i class="fa fa-keyboard-o"></i>
			<span>Last Login</span>
		</th>
		
		<th class="status">
			<i class="fa fa-info-circle"></i>
			<span>Status</span>
		</th>
	</tr>
</thead>

<tbody>
</tbody>