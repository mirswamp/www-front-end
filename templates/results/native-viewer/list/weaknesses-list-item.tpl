<% if (typeof bugLocation !== 'undefined') { %>
<td class="file">
	<a href="<%= url + '?file=' + filename %>" target="_blank"><%= textToHtml(filename) %></a>
</td>
<% } %>

<% if (typeof bugLocation !== 'undefined') { %>
<td class="line">
	<% if (bugLocation.StartLine) { %>
	<div class="line-number">
		<a href="<%= url + (queryString? '?' + queryString : '') %>" target="_blank">
		<% if (bugLocation.StartLine ==  bugLocation.EndLine) { %>
		<%= bugLocation.StartLine %>
		<% } else if (bugLocation.StartLine && bugLocation.EndLine) { %>
		<%= bugLocation.StartLine %> - <%= bugLocation.EndLine %>
		<% } else { %>
		<%= bugLocation.StartLine %>
		<% } %>
		</a>
	</div>
	<% } %>
</td>
<% } %>

<% if (typeof bugLocation !== 'undefined') { %>
<td class="column">
	<% if (bugLocation.StartColumn) { %>
	<div class="column-number">
		<% if (bugLocation.StartColumn ==  bugLocation.EndColumn) { %>
		<%= bugLocation.StartColumn %>
		<% } else if (bugLocation.StartColumn && bugLocation.EndColumn) { %>
		<%= bugLocation.StartColumn %> - <%= bugLocation.EndColumn %>
		<% } else { %>
		<%= bugLocation.StartColumn %>
		<% } %>
	</div>
	<% } %>
</td>
<% } %>

<% if (typeof BugSeverity !== 'undefined') { %>
<td class="group">
	<%= BugSeverity %>
</td>
<% } %>

<% if (typeof BugGroup !== 'undefined') { %>
<td class="group">
	<%= textToHtml(BugGroup) %>
</td>
<% } %>

<% if (typeof BugCode !== 'undefined') { %>
<td class="code">
	<%= textToHtml(BugCode) %>

	<a class="message" data-toggle="popover" data-original-title="Message" data-placement="top" data-content="<%= unquotateHTML(BugMessage) %>"><i class="fa fa fa-info-circle" data-toggle="tooltip" title="Click for bug info" data-placement="left" style="margin-left:15px;"></i></a>

	<% if (typeof ResolutionSuggestion !== 'undefined') { %>
	<a class="suggestion" data-toggle="popover" data-original-title="Suggestion" data-placement="top" data-html="true" data-content="<%= ResolutionSuggestion.replace( /\s\s+/g, ' ' ).replace(/\"/g, '&quot;') %>"><i class="fa fa fa-lightbulb-o" data-toggle="tooltip" title="Click for suggestions" data-placement="left" style="margin-left:15px;"></i></a>
	<% } %>
</td>
<% } %>