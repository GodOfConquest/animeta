var React = require('react/addons');
var GlobalHeader = require('./GlobalHeader');
var WorkViews = require('./WorkViews');
var util = require('./util');
if (process.env.CLIENT) {
    require('../less/work.less?extract');
}

var cx = React.addons.classSet;

var App = React.createClass({
    render() {
        var PreloadData = this.props.PreloadData;
        var url = util.getWorkURL(PreloadData.work.title);
        return <div>
            <GlobalHeader currentUser={PreloadData.current_user} />
            <WorkViews.Work
                work={PreloadData.work}
                chart={PreloadData.chart}
            >
                <div className="episodes">
                    <a href={url} className="recent">최신</a>
                    {PreloadData.work.episodes.map(ep =>
                        <a href={url + '#/ep/' + ep.number + '/'}
                            className={cx({
                                'has-post': ep.post_count > 0,
                                'active': ep.number === PreloadData.post.status
                            })}
                        >
                            {ep.number}화
                        </a>
                    )}
                </div>
                <div className="post-detail">
                    <WorkViews.Post post={PreloadData.post} />
                </div>
                <WorkViews.WorkIndex
                    work={PreloadData.work}
                    episode={PreloadData.post.status}
                    excludePostID={PreloadData.post.id} />
            </WorkViews.Work>
        </div>;
    }
});

if (process.env.CLIENT) {
    React.render(
        <App PreloadData={global.PreloadData} />,
        document.getElementById('app')
    );
} else {
    module.exports = App;
}
