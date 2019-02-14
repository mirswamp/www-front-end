<% if (showNumbering) { %>
<td class="prepend number">
	<%- index %>
</td>
<% } %>

<% if (typeof bugLocation != 'undefined') { %>
<td class="file first">
	<%= stringToHTML(bugLocation.SourceFile) %>
</td>
<% } %>

<% if (typeof bugLocation != 'undefined') { %>
<td class="line-number">
	<% if (bugLocation.StartLine ==  bugLocation.EndLine) { %>
	<%= bugLocation.StartLine %>
	<% } else if (bugLocation.StartLine && bugLocation.EndLine) { %>
	<%= bugLocation.StartLine %> - <%= bugLocation.EndLine %>
	<% } else { %>
	<%= bugLocation.StartLine %>
	<% } %>
</td>
<% } %>

<% if (typeof bugLocation != 'undefined') { %>
<td class="column-number">
	<% if (bugLocation.StartColumn ==  bugLocation.EndColumn) { %>
	<%= bugLocation.StartColumn %>
	<% } else if (bugLocation.StartColumn && bugLocation.EndColumn) { %>
	<%= bugLocation.StartColumn %> - <%= bugLocation.EndColumn %>
	<% } else { %>
	<%= bugLocation.StartColumn %>
	<% } %>
</td>
<% } %>

<% if (typeof BugSeverity != 'undefined') { %>
<td class="group">
	<%= BugSeverity %>
</td>
<% } %>

<% if (typeof BugGroup != 'undefined') { %>
<td class="group">
	<%= stringToHTML(BugGroup) %>
</td>
<% } %>

<% if (typeof BugCode != 'undefined') { %>
<td class="code last">
	<%= stringToHTML(BugCode) %>

	<a class="message" data-toggle="popover" data-original-title="Message" data-html="true" data-placement="top" data-content="<%= unquotateHTML(BugMessage) %>"><i class="fa fa fa-info-circle" data-toggle="tooltip" title="Click for bug info" data-placement="left" style="margin-left:15px;"></i></a>

	<% if (typeof ResolutionSuggestion != 'undefined') { %>
	<a class="suggestion" data-toggle="popover" data-original-title="Suggestion" data-html="true" data-placement="top" data-content="<%= unquotateHTML(ResolutionSuggestion) %>"><i class="fa fa fa-lightbulb-o" data-toggle="tooltip" title="Click for suggestions" data-placement="left" style="margin-left:15px;"></i></a>
</td>
	<% } %>
<% } %>
