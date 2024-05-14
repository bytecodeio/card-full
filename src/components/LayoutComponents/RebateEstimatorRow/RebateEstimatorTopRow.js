import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { TransposedTable } from '../TransposedTable';
import { useEffect } from 'react';

export const RebateEstimatorTopRow = ({formatFilters, updatedFilters, visList}) => {
    return (
        <Container fluid className="padding-0">
            <Row className="fullW mb-1">
                <Col md={12} lg={12} className="position-relative">
                    <div>Test Column 3</div>
                </Col>
            </Row>
        </Container>
    )
}