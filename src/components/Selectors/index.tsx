import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import RangeSlider from 'react-bootstrap-range-slider';
import { v4 as UUIDv4 } from 'uuid';

interface Props {
    setSeed: (seed: string) => void,
    setRegion: (region: string) => void,
    seed: string,
    region: string,
};

const MIN = 0;
const MAX = 1000;

const SliderWithInputFormControl = () => {

    const [errorsCount, setErrorsCount] = useState<number | ''>(25);

    const calcValue = (val: number) => {
        if (val > MAX) {
            return MAX;
        }

        if (val < MIN) {
            return MIN;
        }

        return val;
    };

    const handleErrorCountInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const inputVal = e.currentTarget.value.replace(
            /((?!([-]|([-]?\d+))).)/,
            ''
        );

        if (inputVal === '') {
            return setErrorsCount('')
        }

        const newValue = parseInt(inputVal, 10);

        setErrorsCount(calcValue(newValue))
    }

    return (
        <Form>
            <Form.Group>
                <div className="d-flex gap-2">
                    <RangeSlider
                        value={errorsCount || 0}
                        min={MIN}
                        max={MAX}
                        tooltip='off'
                        onChange={(e) => setErrorsCount(parseInt(e.target.value))}
                    />
                    <Form.Control value={errorsCount} onChange={handleErrorCountInputChange} type="number" />
                </div>
            </Form.Group>
        </Form>
    );

};

function Selectors(props: Props) {
    const handleRandomizeSeed = () => {
        const newSeed = UUIDv4().slice(0, 6)
        props.setSeed(newSeed);
    };

    const handleRegionChange = (value: string) => {
        props.setRegion(value);
    };

    return (
        <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Card.Title>Users generator</Card.Title>
            <Form.Select onChange={(e) => handleRegionChange(e.target.value)} aria-label="Region select">
                <option>Choose region</option>
                <option value="AU" >Australia</option>
                <option value="BR">Brazil</option>
                <option value="CA">Canada</option>
            </Form.Select>
            <Form.Label>Errors count per row</Form.Label>
            <SliderWithInputFormControl />
            <Form.Label>Seed</Form.Label>
            <div className="d-flex gap-2">
                <Form.Control style={{ width: '200px' }} value={props.seed} onChange={(e) => props.setSeed(e.target.value)} type="numeric" />
                <Button type='button' onClick={handleRandomizeSeed}>Random seed</Button>
            </div>
        </Card>
    )
};

export default Selectors;