/* @flow */

import React, { Component } from "react";

type Props = {
    title: string,
    query: any,
};
export default class FilterByLabel extends Component {
    props: Props;

    constructor(props: Props) {
        super(props);
    }

    getFiltersForDisplay = () => {
        const labels: [] = [];
        try {
            const filters = JSON.parse(JSON.stringify(this.props.query.filters()));
            console.log('filters', filters);
            if (filters.length === 0) {
                return '';
            }
            const reversedFilters = filters.reverse();
            for (let r = 0; r < reversedFilters.length; r++) {
                const op = reversedFilters[r][0];
                if (op !== 'between' && op !== 'segment') {
                    labels.push(reversedFilters[r][reversedFilters[r].length - 1]);
                }
            }
        } catch (error) {
            console.log('error', error);
        }
        return labels.join(', ');
    };

    render() {
        const { title } = this.props;
        const style1 = {
            fontWeight: 600,
            minHeight: 30,
            minWidth: 150,
            color: '#74838f',
            display: 'flex',
            alignItems: 'center'
        }
        const style2 = {
            transition: 'opacity 500ms linear',
            border: '2px solid #d7dbde',
            marginRight: '0.85em',
            marginBottom: '0.5em',
            padding: '0.25em 1em 0.25em 1em'
        }
        const labels = this.getFiltersForDisplay();
        if (labels.trim() === '') {
            return null;
        }
        return (

            <div className="wrapper flex flex-column align-start mt2 relative z2">
                <div className="flex align-end flex-wrap flex-row">
                    <fieldset className="relative hover-parent hover--visibility bordered rounded" style={style2}>
                        <legend className="h5 text-bold px1 text-nowrap text-medium">{title}</legend>
                        <div>
                            <div className="" style={style1}>
                                <svg className="Icon Icon-label flex-align-left mr1 flex-no-shrink Icon-cxuQhR kTAgZA" viewBox="0 0 32 32" width="14" height="14" fill="currentcolor" name="label" size="14">
                                    <path d="M14.577 31.042a2.005 2.005 0 0 1-2.738-.733L1.707 12.759c-.277-.477-.298-1.265-.049-1.757L6.45 1.537C6.7 1.044 7.35.67 7.9.7l10.593.582c.551.03 1.22.44 1.498.921l10.132 17.55a2.002 2.002 0 0 1-.734 2.737l-14.812 8.552zm.215-22.763a3.016 3.016 0 1 0-5.224 3.016 3.016 3.016 0 0 0 5.224-3.016z"></path>
                                </svg>
                                <div className="flex-full cursor-pointer" style={{ maxWidth: '90%', wordBreak: 'break-word' }}>
                                    <span>
                                        {this.getFiltersForDisplay()}
                                    </span>
                                </div>
                                <svg className="Icon Icon-empty flex-align-right cursor-pointer flex-no-shrink Icon-cxuQhR kTAgZA" viewBox="0 0 32 32" width="12" height="12" fill="currentcolor" name="empty" size="12">
                                    <path d=" "></path>
                                </svg>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
        );
    }
}