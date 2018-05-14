<div id="clickedelement-plugin-container">
    <div class="wrap">
        <h1 class="wp-heading-inline">クリックされた要素</h1>

        <div>
            <input type="date" name="clicked_dt" id="clicked_dt">
            <select id="path"></select>
        </div>
        <div id="xpathsContainer" style="height: 300px;overflow-y: scroll;margin-bottom: 5px;">
            <table class="wp-list-table widefat">
                <thead>
                    <tr>
                        <th scope="col">クリック回数</th>
                        <th scope="col">XPath</th>
                    </tr>
                </thead>
                <tbody id="xpaths">
                </tbody>        
            </table>
        </div>
        <iframe id="clickedelement-viewer" style="width:100%;min-height:300px;"></iframe>
    </div>
</div>